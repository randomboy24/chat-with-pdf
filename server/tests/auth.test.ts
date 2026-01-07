import { describe, it, mock, before, after } from 'node:test';
import assert from 'node:assert';

// Mock the auth service
const mockAuthService = {
  signUp: mock.fn(async () => 'mock-token'),
  login: mock.fn(async () => 'mock-token'),
};

// Mock the module
mock.module('../dist/services/auth.service.js', {
  namedExports: mockAuthService,
});

// Import the controller from dist dynamically to ensure mock is applied first
let authController: any;

before(async () => {
  authController = await import('../dist/controllers/auth.controller.js');
});

describe('Auth Controller', () => {
  describe('signUp', () => {
    it('should return 400 if validation fails', async () => {
      const req = {
        body: {}, // Missing required fields
      };
      
      const res = {
        status: mock.fn(function(this: any, code) {
          assert.strictEqual(code, 400);
          return this;
        }),
        json: mock.fn(),
      };

      await authController.signUp(req as any, res as any);
      
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
        status: mock.fn(function(this: any, code) {
          assert.strictEqual(code, 201);
          return this;
        }),
        json: mock.fn(),
      };

      await authController.signUp(req as any, res as any);

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
        status: mock.fn(function(this: any, code) {
          assert.strictEqual(code, 400);
          return this;
        }),
        json: mock.fn(),
      };

      await authController.signUp(req as any, res as any);

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
        status: mock.fn(function(this: any, code) {
          assert.strictEqual(code, 400);
          return this;
        }),
        json: mock.fn(),
      };

      await authController.login(req as any, res as any);

      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.json.mock.calls.length, 1);
    });

    it('should return 200 and set cookie on successful login', async () => {
      const req = {
        body: {
          name: 'Test User',
          password: 'password123',
        },
      };

      const token = 'mock-token';
      mockAuthService.login.mock.mockImplementation(async () => token);

      const res = {
        cookie: mock.fn(),
        status: mock.fn(function(this: any, code) {
          assert.strictEqual(code, 200);
          return this;
        }),
        json: mock.fn(),
      };

      await authController.login(req as any, res as any);

      assert.strictEqual(mockAuthService.login.mock.calls.length, 1);
      assert.strictEqual(res.cookie.mock.calls.length, 1);
      assert.strictEqual(res.status.mock.calls.length, 1);
    });

    it('should return 400 if user does not exist', async () => {
      const req = {
        body: {
          name: 'Nonexistent User',
          password: 'password123',
        },
      };

      const error = new Error("User doesn't exists");
      mockAuthService.login.mock.mockImplementation(async () => {
        throw error;
      });

      const res = {
        status: mock.fn(function(this: any, code) {
          assert.strictEqual(code, 400);
          return this;
        }),
        json: mock.fn(),
      };

      await authController.login(req as any, res as any);

      assert.strictEqual(res.status.mock.calls.length, 1);
      assert.strictEqual(res.json.mock.calls.length, 1);
    });
  });
});
