원본 업로드가 아니라 오류 있을수도있습니다. 오류생기면 말해주세요.

#개발환경 -java_21 -spring boot -MySQL 9.3 (5.6이상이면 상관 없습니다.)

##실행 전 필수 확인 사항(application.properties) -데이터베이스 이름을 자신에 맞는 데이터 베이스로 수정. -데이터베이스 유저이름과 비밀번호 수정. -그외 수정 금지.

데이터 베이스 오류 해결 방법
-intellij에서 데이터 베이스를 생성, 생성된 데이터베이스 우클릭-> 프로퍼티 -> 하단 연결 테스트 -오류 42000 데이터 베이스가 없어서 생기는 오류 : 윈도우 검색 창-> MySQL Command Line Client 클릭-> CREATE DATABASE 원하는 이름-> 엔터-> 다시 테스트 실행 (그래도 안되면 실행 전 필수사항 확인, 그래도 또안되면 연락 부탁).

데이터 베이스 내용
-MANU : id(아이디) available(사용 여부) description(설명 필드) name(매뉴 명) price(가격) sategory_id(카테고리 아이디 외래키). -MenuCategory : id(아이디) creatde_at(생성 날/시간) descriptoin(설명 필드) name status
