const successResponse = (res, message, data = null) => {
  res.status(200).json({
    success: true,
    message,
    data,
  });
};

const createdResponse = (res, message, data = null) => {
  res.status(201).json({
    success: true,
    message,
    data,
  });
};

export { successResponse, createdResponse };
