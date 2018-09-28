import React, { Component } from 'react';
import { axiosGitHubGraphQL } from '../../api/github'
import _ from 'lodash';
import './style.css'

export default class User extends Component {

    state = {
        path: null,
        user: null,
        errors: null,
    };

    onFetchFromGitHub = () => {
        console.log(this.state.path);
        
        const GET_USER = `{
        repositoryOwner(login: ${this.state.path}) {
            login
            avatarUrl
            id
            url
            ...on User {
            bio
            followers(first: 1){
                totalCount
            }
            following(first: 1){
                totalCount
            }
            }
            repositories(last: 2, isFork: false){
            totalCount
            nodes {
                name
                url
                updatedAt
            }
            }
        }
        }`;
        axiosGitHubGraphQL
            .post('', { query: GET_USER })
            .then(result =>
                this.setState(() => ({
                    user: result.data.data.repositoryOwner,
                    repositories: null,
                    errors: result.data.errors,
                })),
            );
    }

    getRepo() {
        const user = this.state.user;
        var repo = _.map(user.repositories.nodes, (repo, i) => {
            return (<Repo
                key={i}
                name={repo.name}
                url={repo.url}
                update={repo.updatedAt.substring(0, 10)}
            />)
        })
        return repo
    }

    handleSubmit(e) {
        e.preventDefault()
        this.setState({path: this.refs.login.value})
        console.log(this.state);
        setTimeout(() => {            
            this.onFetchFromGitHub();
        }, 1000);
    }

    render() {
        const { user, errors } = this.state;

        return (
            <div>
                <header className="header">
                    <h1 className="">Github Users</h1>
                </header>
                <form onSubmit={e => this.handleSubmit(e)}>
                    <input
                        className='input'
                        ref='login'
                        type="text"
                        placeholder="Search"
                    />
                </form>
                    {user ? (
                        <div className='user-card'>
                            <div>
                                <UserInfo user={user} errors={errors} />
                                <div className='repo-grid'>
                                    {this.getRepo()}
                                </div>
                            </div>
                        </div>
                    ) : (
                            <p>Searching for Organisation or User</p>
                        )}
            </div>
        );
    }

}

const UserInfo = ({ user }) => (
    <div className='user'>
        <img className='user-pic' src={user.avatarUrl} alt={user.login} />
        <h2 className='user-login'>{user.login}</h2>
        <p className='user-bio'>{user.bio}</p>
        {user.followers ? (
        <div className='user-info'>
            <p className='user-follow'>{user.followers.totalCount} Followers </p>
            <p className='user-follow'>Following {user.following.totalCount}</p>
        </div>
        ) : (<p className='user-follow'>Organisation</p>)}
        <p className='user-repo-count'>{user.repositories.totalCount} Repositories</p>
        <div className='user-repo-container'>
            <h3 className='user-repo-title'>Lastest repository</h3>
            <div className=''>
            </div>
        </div>
    </div>
);

export class Repo extends React.Component {
    render() {
        return (
            <div className='repo-content'>
                <h4 className='repo-name'>{this.props.name}</h4>
                <a className='repo-url' href={this.props.url}>View on Github</a>
                <p className='repo-update'><span>Last update:</span> {this.props.update}</p>
            </div>
        )
    }
}
