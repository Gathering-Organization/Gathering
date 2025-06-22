import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileStateContext';

const Admin: React.FC = () => {
  const { myProfile } = useProfile();
  const [adminList, setAdminList] = useState<string[]>(['게더링#758743', '윤종근#771371']);
  const [nicknameInput, setNicknameInput] = useState('');
  const [userList, setUserList] = useState<string[]>([
    '게더링#758743',
    '코딩왕#1234',
    '디자인여왕#5678',
    '프론트마스터#2024'
  ]);
  const [searchUser, setSearchUser] = useState('');
  const [postList, setPostList] = useState<{ id: number; title: string; deleted: boolean }[]>([
    { id: 1, title: '모집글 A', deleted: false },
    { id: 2, title: '모집글 B', deleted: true },
    { id: 3, title: '모집글 C', deleted: false }
  ]);
  const [userCount, setUserCount] = useState(3);

  if (!adminList.includes(myProfile.nickname)) {
    return <div className="text-center mt-20 text-xl font-semibold">접근 권한이 없습니다.</div>;
  }

  return (
    <div className="mx-36 space-y-12 py-10">
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">유저 수</h2>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded"
            onClick={() => {
              console.log('유저 수 새로고침');
            }}
          >
            새로고침
          </button>
        </div>
        <p className="text-gray-700">총 유저 수: {userCount}명</p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">멤버 ID 조회</h2>
        <input
          type="text"
          placeholder="닉네임 검색"
          className="border px-4 py-2 rounded w-full mb-4"
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
        />
        <ul className="space-y-1">
          {userList
            .filter(nickname => nickname.includes(searchUser))
            .map((nickname, idx) => (
              <li key={idx} className="border p-2 rounded bg-gray-50">
                {nickname}
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
          {adminList.map((nickname, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border px-4 py-2 rounded bg-gray-100"
            >
              <span>{nickname}</span>
              {nickname !== myProfile.nickname && (
                <button
                  className="text-sm text-red-500"
                  onClick={() => setAdminList(prev => prev.filter(admin => admin !== nickname))}
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 모집글 조회 및 삭제 */}
      <section>
        <h2 className="text-xl font-bold mb-2">모집글 조회 및 삭제</h2>
        <ul className="space-y-2">
          {postList.map(post => (
            <li
              key={post.id}
              className={`flex justify-between items-center border px-4 py-2 rounded ${
                post.deleted ? 'bg-red-100' : 'bg-white'
              }`}
            >
              <span className={`${post.deleted ? 'text-red-600 font-semibold' : ''}`}>
                {post.title} {post.deleted && '(삭제됨)'}
              </span>
              {post.deleted ? (
                <button
                  className="text-sm text-blue-600"
                  onClick={() => {
                    setPostList(prev =>
                      prev.map(p => (p.id === post.id ? { ...p, deleted: false } : p))
                    );
                  }}
                >
                  복구
                </button>
              ) : (
                <button
                  className="text-sm text-red-600"
                  onClick={() => {
                    setPostList(prev =>
                      prev.map(p => (p.id === post.id ? { ...p, deleted: true } : p))
                    );
                  }}
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
