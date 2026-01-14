const http = require('http');

function request(method, path, data, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 1337,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    if (res.statusCode === 204) return resolve({ status: res.statusCode });

                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function run() {
    // 1. Authenticate (Register a random user)
    const email = `testuser${Date.now()}@example.com`;
    const password = 'Password123!';
    let authResponse = await request('POST', '/api/auth/local/register', {
        username: `User${Date.now()}`,
        email: email,
        password: password,
    });

    let jwt;
    let user;

    if (authResponse.status === 200) {
        jwt = authResponse.data.jwt;
        user = authResponse.data.user;
    } else {
        return;
    }

    // 2. Create Activity
    const activityData = {
        data: {
            title: 'Automated Test Activity',
            editorialStatus: 'published',
            startDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000).toISOString(),
        }
    };

    const activityRes = await request('POST', '/api/activities', activityData, jwt);

    if (activityRes.status !== 201 && activityRes.status !== 200) {
        return;
    }

    const activity = activityRes.data.data;
    const activityId = activity.documentId || activity.id;

    // 3. Create Assignment
    const assignmentData = {
        data: {
            activity: activityId,
            activityStatus: 'assigned',
            user: user.id, // linking to the user we just created
        }
    };

    const assignmentRes = await request('POST', '/api/assignments', assignmentData, jwt);

    if (assignmentRes.status !== 201 && assignmentRes.status !== 200) {
        return;
    }

    const assignment = assignmentRes.data.data;
    const assignmentId = assignment.documentId || assignment.id;

    // 4. Update Assignment (add feedback)
    const updateData = {
        data: {
            feedbackThread: [
                {
                    message: 'This is a test feedback msg',
                    authorName: 'TestBot',
                    postedAt: new Date().toISOString()
                }
            ]
        }
    };

    const updateRes = await request('PUT', `/api/assignments/${assignmentId}`, updateData, jwt);
}

run();
