import PostItem from './PostItem';
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
          <PostItem key={item.projectId} {...item} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
