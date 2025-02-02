import PostItem from './PostItem';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { approxPostInfo } from './../types/post';

// interface PostListProps {
//   data: approxPostInfo[];
// }

type approxPostProps = {
  data: approxPostInfo[];
};

const PostList: React.FC<approxPostProps> = ({ data }) => {
  return (
    <div>
      <div>
        {data.map(item => (
          <PostItem key={1} {...item} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
