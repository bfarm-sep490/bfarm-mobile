import { Asset } from 'react-native-image-picker';
import { ICreateProblem, IProblem } from 'src/interfaces';

import { IResponse, instance } from '../instance';

export const getProblemsByFarmerId = async (farmerId: number) => {
  try {
    const response = await instance.get('problems', {
      searchParams: {
        farmer_id: farmerId,
      },
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IProblem[],
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};

export const getProblemsById = async (id: number) => {
  try {
    const response = await instance.get('problems/' + id);
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IProblem,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const createProblem = async (report: ICreateProblem) => {
  try {
    const response = await instance.post('problems', {
      json: report,
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IProblem,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const planByFarmerId = async (farmerId: number) => {
  try {
    const response = await instance.get('plans/farmer/' + farmerId);
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const uploadProblemImage = async (image: Asset) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri!,
      type: image.type || 'image/jpeg',
      name: image.fileName || 'upload.jpg',
    } as any);

    const response = await instance.post('problems/images/upload', {
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as string[],
    };
  } catch (error: any) {
    return {
      message: error.message || 'Unknown error',
      status: 500,
      data: null,
    };
  }
};
