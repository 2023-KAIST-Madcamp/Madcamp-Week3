# DevToday

### KAIST MadCamp Week3

---

## a. 개발 팀원

- 박진석 - 성균관대학교 소프트웨어학과 20학번
- 이형진 - 카이스트 전산학부 22학번

---

## b. 개발환경

- Language : Javascript, Python
- Framework : React Native, Flask
- Database : MongoDB
- Deployment : AWS EC2
- OS : Android
- IDE : Visual Studio Code
- Target Device : Samsung Flip 4, Samsung S21

---

## c. 어플리케이션 소개

### 1. 로딩창

![image](https://github.com/HYJP-KAIST-Madcamp-Week3/MadCamp3/assets/68769481/eeddac07-90e5-4567-82e3-96b9e1932cd1)

#### 주요 특징

- 카카오 계정으로 로그인할 수 있습니다.

### 2. 메인화면

![image](https://github.com/HYJP-KAIST-Madcamp-Week3/MadCamp3/assets/68769481/b61b8a87-73ad-4e1e-95e5-43f77c7f3a45)

#### 주요 특징

- 카카오톡 로그인을 통해 사용자 이름 및 프로필 사진을 불러올 수 있습니다.
- 3가지 탭(Velog, Today, Map)으로 구성되어 있습니다.
- 상단의 네비게이션 바를 클릭해서 탭을 이동할 수 있습니다.
- 상단 우측의 프로필 버튼을 눌러 프로필 편집 화면으로 이동할 수 있습니다.
![image](https://github.com/HYJP-KAIST-Madcamp-Week3/MadCamp3/assets/68769481/d9f3e730-8881-4ba3-8c52-bce16668cb43)

### 3. DevLog

### 주요 특징

- 사용자들이 개발과 관련된 정보를 나누는 공간입니다.
- 사용자가 블로그 형태의 글을 쓸 수 있습니다.
- 글은 텍스트블럭과 이미지들의 배열로 이루어져 텍스트와 이미지를 섞어가며 화면을 자유롭게 구성할 수 있습니다.
- 생성된 DevLog는 데이터베이스에 추가되고, 다른 사용자들이 피드에서 볼 수 있습니다.
- 각 DevLog의 맨 밑에 추천 버튼이 있고, 추천과 추천 취소를 할 수 있습니다.

### 4. DevToday

#### 주요 특징

- Today는 '오늘 개발 완료'라는 의미로 퇴근하기 전에 자신의 setup 사진을 찍어 올리는 공간입니다.
- 카메라나 갤러리를 통해 사진만을 업로드할 수 있습니다.
- 내가 생성한 Today에는 자신의 위치와 시간정보가 포함되어 저장됩니다.
- 피드에서 다른 사람의 Today들도 볼 수 있고, 날짜별로 정렬되어 있습니다.

### 5. FriendMap

#### 주요 특징

- FriendMap에서는 내 친구들이 가장 최근에 올린 DevToday의 위치를 기반으로 지도에 친구들의 프로필 사진을 표시합니다.
- 혼자 개발하는 시간이 많은 개발자들에게 다른 사람들과 같이 일을 하고 있다는 느낌을 주기 위해 추가한 기능입니다.



![profile](https://github.com/HYJP-KAIST-Madcamp-Week3/MadCamp3/assets/68769481/370d388b-bed1-45ad-b57f-b17c48a7ec19)


### 6. Profile

#### 주요 특징

- 상단에 자신의 프로필 사진, 닉네임, 코드, 친구 수가 표시됩니다.
- 친구의 코드를 입력하면 친구를 follow할 수 있습니다.
- 친구 수를 누르면 친구 리스트로 이동합니다. 친구 리스트에서는 친구를 unfollow할 수 있습니다.
- 나머지 공간에는 자신이 올린 DevLog, DevToday, Map(내 Today들의 위치가 표시됨)이 나타나고 네비게이션 바를 통해 탭을 이동할 수 있습니다.

### 기술 특징

- dp 저장 형태
  
|Collection|Document|
|------|--- |
|User|{_id, kakao_id, nickname, code, thumbnail_image_url, [friends], location, online} |
|Today|{_id, user_id, image, location, time} |
|Velog|{_id, title, user_id, sections, tags, time, thumbs} |
|Velog_Recommended|{_id, velog_id, user_id, time} |

- frontend에서 보낸 사진파일을 backend에서 저장하고 url형태로 db에 저장합니다.
- Backend 서버는 AWS EC2에 배포해 nohup을 통해 백그라운드로 실행하고 있습니다.
