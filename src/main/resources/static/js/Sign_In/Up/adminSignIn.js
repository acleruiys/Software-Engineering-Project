document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const phoneInput = document.getElementById('phone');

    // 전화번호 입력 시 자동으로 하이픈 추가
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기

        if (value.length > 11) {
            value = value.substring(0, 11); // 최대 11자리
        }

        // 하이픈 추가
        if (value.length >= 3 && value.length <= 7) {
            value = value.substring(0, 3) + '-' + value.substring(3);
        } else if (value.length > 7) {
            value = value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7);
        }

        e.target.value = value;
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 입력값 가져오기
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value;
        const role = document.getElementById('role').value;

        // 유효성 검사
        if (!username || !password || !confirmPassword || !phone || !role) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 전화번호 형식 검증 (010-0000-0000)
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            alert('전화번호는 010-0000-0000 형식으로 입력해주세요.');
            return;
        }

        // 서버로 데이터 전송
        const userData = {
            username: username,
            password: password,
            phone: phone,
            role: role
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