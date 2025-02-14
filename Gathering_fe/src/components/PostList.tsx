import PostItem from '@/components/PostItem';
import { approxPostInfo } from '@/types/post';

const PostList: React.FC<{ data: approxPostInfo[] }> = ({ data }) => {
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
