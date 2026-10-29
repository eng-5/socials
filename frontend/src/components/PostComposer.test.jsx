import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostComposer from './PostComposer';

describe('PostComposer', () => {
    it('calls onPost with the typed text when Post is clicked', async () => {
        const user = userEvent.setup();
        const onPost = vi.fn(); // a fake function that records how it was called

        render(<PostComposer onPost={onPost} />)

        const textarea = screen.getByPlaceholderText(/What's sparking in your mind/i);
        await user.type(textarea, 'hello world');

        const postButton = screen.getByRole('button', { name: /post/i })
        await user.click(postButton);

        expect(onPost).toHaveBeenCalledWith('hello world');
    });
});