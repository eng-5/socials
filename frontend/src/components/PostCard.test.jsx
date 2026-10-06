import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostCard from './PostCard'

describe('PostCard', () => {
    it('Checks to see if all the post data are all rendered correctly', async () => {
        const post = {
            authorId: 'author-2345',
            createdAt: new Date().toISOString(),
            text: 'Hello World',
            likes: ['user-1']

        }
        render(<PostCard post={post} />)
        expect(screen.getByText('Hello World')).toBeInTheDocument();
        expect(screen.getByText(/author/)).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('A')).toBeInTheDocument();


    })
})
