import { Asset } from 'react-native-image-picker';
import {
  IHarvestingTask,
  IPackagingTask,
  IReportHarvestingTask,
  IReportPackagingTask,
} from 'src/interfaces';

import { instance, IResponse } from '../instance';

export const getPackagingTasksByFarmerId = async (farmerId: number) => {
  try {
    const response = await instance.get('caring-tasks', {
      searchParams: {
        farmer_id: farmerId,
      },
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IPackagingTask[],
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};

export const getDetailPackagingTasksById = async (id: number) => {
  try {
    const response = await instance.get('packaging-tasks/' + id);
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IPackagingTask,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const putReportPackagingTasksById = async (
  id: number,
  report: IReportPackagingTask,
) => {
  try {
    const response = await instance.put('packaging-tasks/' + id + '/report', {
      json: report,
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IPackagingTask,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const uploadPackagingTaskImage = async (images: Asset[]) => {
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
    const response = await instance.post('packaging-tasks/images/upload', {
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
