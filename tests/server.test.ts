import { test, expect } from 'bun:test';

test("server is running", async () => {
    const response = await fetch("http://127.0.0.1:8080/");
    expect(response.status).toBe(200);
});