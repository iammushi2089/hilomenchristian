// test.js
console.log('Test script running');
try {
  require('dotenv').config();
  console.log('Dotenv loaded');
  const express = require('express');
  console.log('Express loaded');
  console.log('All good!');
} catch (err) {
  console.error('Error:', err.message);
}