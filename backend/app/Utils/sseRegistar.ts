import { ResponseContract } from "@ioc:Adonis/Core/Response";

const sseRegisteredUsers = new Map<string, ResponseContract>();

const sendSseData = (userCompositeKey: string, data?: any) => {
  let obj = { data: "No data" };
  if (data) {
    obj = data;
  }
  const response = sseRegisteredUsers.get(userCompositeKey);
  if (response) {
    return response.response.write(`data: ${JSON.stringify(obj)}\n\n`);
  }
};

const broadcastToDistrict = (districtId: string, data?: any) => {
  sseRegisteredUsers.forEach((response, userCompositeKey) => {
    const [, keyDistrictId] = userCompositeKey.split("_");
    if (keyDistrictId === districtId) {
      data = { ...data, dataType: "DISTRICT_UPDATE" };
      return response.response.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
};

export { sseRegisteredUsers, sendSseData, broadcastToDistrict };
