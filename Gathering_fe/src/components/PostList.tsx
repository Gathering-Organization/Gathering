import PostItem from '@/components/PostItem';
import { approxPostInfo } from '@/types/post';

const PostList: React.FC<{ data: approxPostInfo[] }> = ({ data }) => {
  return (
    <div className="min-h-[700px]">
      <div className="grid grid-cols-3 gap-10">
        {data.map(item => (
          <PostItem key={item.projectId} {...item} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
