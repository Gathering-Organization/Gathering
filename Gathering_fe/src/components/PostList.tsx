import PostItem from '@/components/PostItem';
import { ApproxPostInfo } from '@/types/post';

interface PostListProps {
  data: ApproxPostInfo[];
  onInterestToggle?: (projectId: number, newValue: boolean) => void;
}

const PostList: React.FC<PostListProps> = ({ data, onInterestToggle }) => {
  return (
    <div className="min-h-[700px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <PostItem key={item.projectId} {...item} onInterestToggle={onInterestToggle} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
