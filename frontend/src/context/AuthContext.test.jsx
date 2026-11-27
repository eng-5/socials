import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import * as authApi from '../api/auth';

vi.mock('../api/auth');

// jwt-decode only reads the middle part, so a fake token is enough
const fakeJwt = (exp) => `h.${btoa(JSON.stringify({ exp }))}.s`;
const inOneHour = () => Math.floor(Date.now() / 1000) + 3600;

function Probe() {
    const { user, loading, authError } = useAuth();
    if (loading) return <p>loading</p>;
    return <p>{authError ? 'server-unreachable' : user ? 'in' : 'out'}</p>
}

function LoginProbe() {
    const { user, loading, authError, login } = useAuth();
    if (loading) return <p>loading</p>;
    return (
        <>
            <p>{authError ? 'server-unreachable' : user ? 'in' : 'out'}</p>
            <button onClick={() => login({ email: 'a@b.c', password: 'x' })}>go</button>
        </>
    )
}

beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
});

it('keeps the token when /me fails with a 503', async () => {
    localStorage.setItem('token', fakeJwt(inOneHour()));
    authApi.getMe.mockRejectedValue({ response: { status: 503 } });

    render(<AuthProvider><Probe /></AuthProvider>)
    await screen.findByText('server-unreachable');
    expect(localStorage.getItem('token')).not.toBeNull();
});

it('clears the token when /me fails with a 401', async () => {
    localStorage.setItem('token', fakeJwt(inOneHour()));
    authApi.getMe.mockRejectedValue({ response: { status: 401 } });

    render(<AuthProvider><Probe /></AuthProvider>);
    await screen.findByText('out');
    expect(localStorage.getItem('token')).toBeNull();
})

it('clears authError after a successful login', async () => {
    localStorage.setItem('token', fakeJwt(inOneHour()));
    authApi.getMe.mockRejectedValue({ response: { status: 503 } });
    authApi.login.mockResolvedValue({ data: { token: 't', user: { id: 1 } } });

    render(<AuthProvider><LoginProbe /></AuthProvider>);
    await screen.findByText('server-unreachable');
    fireEvent.click(screen.getByText('go'));
    await screen.findByText('in');
});
