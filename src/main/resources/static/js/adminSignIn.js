document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 입력값 가져오기
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value;
        
        // 유효성 검사
        if (!username || !password || !confirmPassword || !phone) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        // 서버로 데이터 전송
        const userData = {
            username: username,
            password: password,
            phone: phone,
            role: 'ADMIN'
        };
        
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || '회원가입에 실패했습니다.');
                });
            }
            return response.json();
        })
        .then(data => {
            alert('회원가입이 완료되었습니다.');
            window.location.href = '/';
        })
        .catch(error => {
            alert(error.message);
            console.error('Error:', error);
        });
    });
}); 