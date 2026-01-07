import { describe, it, mock, before, after } from 'node:test';
import assert from 'node:assert';
// Mock the auth service
const mockAuthService = {
    signUp: mock.fn(),
    login: mock.fn(),
};
// Mock the module
mock.module('../src/services/auth.service.js', {
    namedExports: mockAuthService,
});
// Import the controller
// We use .ts extension for the import here because we are in a TS file and might run with a loader that handles it, 
// or we might need to use .js if we are compiling. 
// Given the project uses ESM with .js imports in TS files, we should probably stick to .js imports 
// but since we are running this test file, if we use ts-node/tsx, it handles .js -> .ts resolution.
// However, if we run with node --experimental-strip-types, we might need to be careful.
// Let's try using .js extension as is standard in this project.
import * as authController from '../src/controllers/auth.controller.js';
describe('Auth Controller', () => {
    describe('signUp', () => {
        it('should return 400 if validation fails', async () => {
            const req = {
                body: {}, // Missing required fields
            };
            const res = {
                status: mock.fn(function (code) {
                    assert.strictEqual(code, 400);
                    return this;
                }),
                json: mock.fn(),
            };
            await authController.signUp(req, res);
            assert.strictEqual(res.status.mock.calls.length, 1);
            assert.strictEqual(res.json.mock.calls.length, 1);
            const jsonCall = res.json.mock.calls[0];
            assert.ok(jsonCall.arguments[0].errors);
        });
        it('should return 201 and set cookie on successful signup', async () => {
            const req = {
                body: {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const token = 'mock-token';
            mockAuthService.signUp.mock.mockImplementation(async () => token);
            const res = {
                cookie: mock.fn(),
                status: mock.fn(function (code) {
                    assert.strictEqual(code, 201);
                    return this;
                }),
                json: mock.fn(),
            };
            await authController.signUp(req, res);
            assert.strictEqual(mockAuthService.signUp.mock.calls.length, 1);
            assert.strictEqual(res.cookie.mock.calls.length, 1);
            assert.strictEqual(res.cookie.mock.calls[0].arguments[0], 'access_token');
            assert.strictEqual(res.cookie.mock.calls[0].arguments[1], token);
            assert.strictEqual(res.status.mock.calls.length, 1);
            assert.strictEqual(res.json.mock.calls.length, 1);
        });
        it('should return 400 if user already exists', async () => {
            const req = {
                body: {
                    name: 'Test User',
                    email: 'existing@example.com',
                    password: 'password123',
                },
            };
            const error = new Error('User already exists');
            mockAuthService.signUp.mock.mockImplementation(async () => {
                throw error;
            });
            const res = {
                status: mock.fn(function (code) {
                    assert.strictEqual(code, 400);
                    return this;
                }),
                json: mock.fn(),
            };
            await authController.signUp(req, res);
            assert.strictEqual(res.status.mock.calls.length, 1);
            assert.strictEqual(res.json.mock.calls.length, 1);
        });
    });
    describe('login', () => {
        it('should return 400 if validation fails', async () => {
            const req = {
                body: {}, // Missing fields
            };
            const res = {
                status: mock.fn(function (code) {
                    assert.strictEqual(code, 400);
                    return this;
                }),
                json: mock.fn(),
            };
            await authController.login(req, res);
            assert.strictEqual(res.status.mock.calls.length, 1);
            assert.strictEqual(res.json.mock.calls.length, 1);
        });
        it('should return 200 and set cookie on successful login', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const token = 'mock-token';
            mockAuthService.login.mock.mockImplementation(async () => token);
            const res = {
                cookie: mock.fn(),
                status: mock.fn(function (code) {
                    assert.strictEqual(code, 200);
                    return this;
                }),
                json: mock.fn(),
            };
            await authController.login(req, res);
            assert.strictEqual(mockAuthService.login.mock.calls.length, 1);
            assert.strictEqual(res.cookie.mock.calls.length, 1);
            assert.strictEqual(res.status.mock.calls.length, 1);
        });
        it('should return 400 if user does not exist', async () => {
            const req = {
                body: {
                    email: 'nonexistent@example.com',
                    password: 'password123',
                },
            };
            const error = new Error("User doesn't exists");
            mockAuthService.login.mock.mockImplementation(async () => {
                throw error;
            });
            const res = {
                status: mock.fn(function (code) {
                    assert.strictEqual(code, 400);
                    return this;
                }),
                json: mock.fn(),
            };
            await authController.login(req, res);
            assert.strictEqual(res.status.mock.calls.length, 1);
            assert.strictEqual(res.json.mock.calls.length, 1);
        });
    });
});
//# sourceMappingURL=auth.test.js.map