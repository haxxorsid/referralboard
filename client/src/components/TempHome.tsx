import { postType } from '../types';

export default function TempHome(props: { posts: postType[]; }) {
    return (
      <div>
        <h2>Home</h2>
        {props.posts &&
                props.posts.map(post => <div key={post.postId}>{post.message} {post.resume} {post.jobLink}</div>)
            }
      </div>
    );
  }