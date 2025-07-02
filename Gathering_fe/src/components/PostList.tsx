import PostItem from '@/components/PostItem';
import { ApproxPostInfo } from '@/types/post';

interface PostListProps {
  data: ApproxPostInfo[];
  onInterestToggle?: (projectId: number, newValue: boolean) => void;
}

const PostList: React.FC<PostListProps> = ({ data, onInterestToggle }) => {
  return (
    <div className="min-h-[700px]">
      <div className="grid grid-cols-3 gap-10">
        {data.map(item => (
          <PostItem key={item.projectId} {...item} onInterestToggle={onInterestToggle} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
