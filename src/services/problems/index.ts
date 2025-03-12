import { Asset } from 'react-native-image-picker';
import {
  ICreateProblem,
  IHarvestingTask,
  IPackagingTask,
  IProblem,
  IReportHarvestingTask,
} from 'src/interfaces';

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
export const uploadProblemImage = async (images: Asset[]) => {
  try {
    const formData = new FormData();
    images?.forEach(image => {
      const imageBlob = {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      } as unknown as Blob;
      formData.append('image', imageBlob, image.fileName);
    });
    const response = await instance.post('problems/images/upload', {
      body: formData,
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as string[],
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
