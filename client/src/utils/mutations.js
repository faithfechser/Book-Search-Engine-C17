import { gql } from '@apollo/client';
// add user
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                email
                username
            }
        }
    }
`;
// login
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                email
                username
            }
        }
    }
`;
// save book
export const SAVE_BOOK = gql`
    mutation saveBook($bookId: String!) {
        saveBook(bookId: $bookId) {
            _id
            username
            email
            savedBooks
        }
    }
`;
// remove book
export const removeBook = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            savedBooks
        }
    }
`;