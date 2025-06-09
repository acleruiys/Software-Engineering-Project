document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 입력값 가져오기
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 유효성 검사
        if (!username || !password) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }
        
        // 서버로 데이터 전송
        const loginData = {
            username: username,
            password: password
        };
        
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || '로그인에 실패했습니다.');
                });
            }
            return response.json();
        })
        .then(data => {
            // 성공 시 대시보드로 이동
            window.location.href = '/dashboard';
        })
        .catch(error => {
            alert(error.message);
            console.error('Error:', error);
        });
    });
}); 