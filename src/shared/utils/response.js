import mongoose from 'mongoose';

const transformObject = (obj) => {
  const { password, _id, __v, ...rest } = obj;
  return { ...(_id && { id: _id }), ...rest };
};

const sanitizeResponse = (data) => {
  let result;
  if (data instanceof mongoose.Document) {
    result = data.toObject();
  } else if (Array.isArray(data)) {
    return data.map(item => sanitizeResponse(item));
  } else {
    result = data && typeof data === 'object' ? { ...data } : data;
  }
  if (result && typeof result === 'object') {
    return transformObject(result);
  }
  return result;
}

export const successResponse = (res, data, message = "Success", status = 200) => {
  const sanitizedData = sanitizeResponse(data);
  return res.status(status).json({
    success: true,
    message,
    data: sanitizedData
  })
}
