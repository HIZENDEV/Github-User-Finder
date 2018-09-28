import axios from 'axios';

export const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
      Authorization: `bearer ${'YOUR_GITHUB_ACCESS_TOKEN'}`,
    },
});