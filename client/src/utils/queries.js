import { gql } from '@apollo/client';

export const queryUser = gql`
    query user {
        user {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                title
                description
                authors
                image
                link
            }
        }
    }
`;