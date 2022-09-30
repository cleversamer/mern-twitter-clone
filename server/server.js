require("dotenv").config();
const setup = require("./src/v1/setup");
const express = require("express");
const app = express();

setup(app);
