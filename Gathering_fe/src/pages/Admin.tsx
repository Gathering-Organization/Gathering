import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/ProfileStateContext';
import {
  getMembersCountAdmin,
  getMembersAdmin,
  getPaginationAdmin,
  patchRoleAdmin,
  deleteProjectAdmin
} from '@/services/adminApi';
import { useToast } from '@/contexts/ToastContext';
import { UserInfo } from '@/types/profile';
import { AdminPostInfo } from '@/types/post';

const Admin: React.FC = () => {
  const { myProfile } = useProfile();
  const [adminList, setAdminList] = useState<string[]>(['게더링#758743', '윤종근#771371', 'admin']);
  const [nicknameInput, setNicknameInput] = useState('');
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchPost, setSearchPost] = useState('');
  const { showToast } = useToast();
  const [postList, setPostList] = useState<AdminPostInfo[]>([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    if (myProfile) {
      fetchMembersCount();
      fetchMemberList();
      fetchPostList();
    }
  }, [myProfile]);

  const fetchMembersCount = async () => {
    try {
      const result = await getMembersCountAdmin();
      if (result?.success) setUserCount(result.data.totalMemberCount);
    } catch (e) {
      console.error('유저 수 조회 실패:', e);
    }
  };

  const fetchMemberList = async () => {
    try {
      const result = await getMembersAdmin();
      if (result?.success) setUserList(result.data);
    } catch (e) {
      console.error('유저 목록 조회 실패:', e);
    }
  };

  const fetchPostList = async () => {
    try {
      const result = await getPaginationAdmin(1, 'TITLE', '');
      if (result?.success) setPostList(result.data);
    } catch (e) {
      console.error('모집글 조회 실패:', e);
    }
  };

  const handleUserReload = async () => {
    try {
      const result = await getMembersCountAdmin();
      if (result?.success) {
        setUserCount(result.data.totalMemberCount);
        showToast('새로고침 되었습니다.', true);
      } else {
        console.log(result?.message || '유저 수 조회 중 오류 발생');
        showToast('새로고침에 실패했습니다.', false);
      }
    } catch (error) {
      console.log('유저 수 조회 실패:', error);
      showToast('새로고침에 실패했습니다.', false);
    }
  };

  const handlePostReload = async () => {
    try {
      const result = await getPaginationAdmin(1, 'TITLE', '');
      if (result?.success) {
        setPostList(result.data);
        showToast('새로고침 되었습니다.', true);
      } else {
        console.log(result?.message || '모집글 조회 중 오류 발생');
        showToast('새로고침에 실패했습니다.', false);
      }
    } catch (error) {
      console.log('모집글 조회 실패:', error);
      showToast('새로고침에 실패했습니다.', false);
    }
  };

  if (!adminList.includes(myProfile.nickname)) {
    return <div className="text-center mt-20 text-xl font-semibold">접근 권한이 없습니다.</div>;
  }

  return (
    <div className="mx-36 space-y-12 py-10">
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">유저 수</h2>
          <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={handleUserReload}>
            새로고침
          </button>
        </div>
        <p className="text-gray-700">총 유저 수: {userCount}명</p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">멤버 조회</h2>
        <input
          type="text"
          placeholder="닉네임 검색"
          className="border px-4 py-2 rounded w-full mb-4"
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
        />
        <ul className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
          {userList
            .filter(user => user.nickname.includes(searchUser))
            .map(user => (
              <li key={user.memberId} className="border p-2 rounded bg-gray-50">
                {`[${user.memberId}] ${user.nickname} (${user.email}) `}
                <span className="font-semibold">
                  {user.role === 'ROLE_ADMIN' ? '관리자' : '회원'}
                </span>
              </li>
            ))}
        </ul>
      </section>

      {/* 멤버 역할 전환 */}
      <section>
        <h2 className="text-xl font-bold mb-2">멤버 역할 전환</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="닉네임 입력"
            className="border px-4 py-2 rounded w-full"
            value={nicknameInput}
            onChange={e => setNicknameInput(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded whitespace-nowrap" // 버튼 글자 세로 방지
            onClick={() => {
              if (nicknameInput && !adminList.includes(nicknameInput)) {
                setAdminList(prev => [...prev, nicknameInput]);
                setNicknameInput('');
              }
            }}
          >
            추가
          </button>
        </div>
        <h3 className="font-semibold mb-1">현재 관리자 목록</h3>
        <ul className="space-y-1">
          {/* {adminList.map((memberId, email, nickname, role) => (
            <li
              key={idx}
              className="flex justify-between items-center border px-4 py-2 rounded bg-gray-100"
            >
              <span>{`${memberId} ${nickname} (${email})_${role}`}</span>
            </li>
          ))} */}
        </ul>
      </section>

      {/* 모집글 조회 및 삭제 */}
      <section>
        <h2 className="text-xl font-bold mb-2">모집글 조회 및 삭제</h2>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="모집글 제목 검색"
            className="border px-4 py-2 rounded w-full"
            value={searchPost}
            onChange={e => setSearchPost(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap"
            onClick={handlePostReload}
          >
            새로고침
          </button>
        </div>
        {/* {userList
            .filter(user => user.nickname.includes(searchUser))
            .map(user => (
              <li key={user.memberId} className="border p-2 rounded bg-gray-50">
                {`[${user.memberId}] ${user.nickname} (${user.email}) `}
                <span className="font-semibold">
                  {user.role === 'ROLE_ADMIN' ? '관리자' : '회원'}
                </span>
              </li>
            ))} */}
        <ul className="space-y-2">
          {postList
            .filter(post => post.title.includes(searchPost))
            .map(post => (
              <li
                key={post.projectId}
                className={`flex justify-between items-center border px-4 py-2 rounded ${
                  post.deleted ? 'bg-red-100' : 'bg-white'
                }`}
              >
                <span className={`${post.deleted ? 'text-red-600 font-semibold' : ''}`}>
                  {post.title} {post.deleted && '(삭제됨)'}
                </span>
                {!post.deleted && (
                  <button
                    className="text-sm text-red-600"
                    // onClick={() => {
                    //   setPostList(prev =>
                    //     prev.map(p => (p.id === post.id ? { ...p, deleted: true } : p))
                    //   );
                    // }}
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
