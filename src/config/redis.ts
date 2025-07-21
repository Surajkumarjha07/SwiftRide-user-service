import { Redis } from "ioredis";

const redis = new Redis("rediss://default:AeqBAAIjcDFmZTk5ZmUyNmQyZGQ0ZGQwOWE2ZmZlNzg4NzZiN2RkYXAxMA@proven-hare-60033.upstash.io:6379");

export default redis;