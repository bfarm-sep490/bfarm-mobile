import { Asset } from 'react-native-image-picker';
import { ICaringTask, IReportCaringTask } from 'src/interfaces';

import { instance, IResponse } from '../instance';

export const getCaringTasksByFarmerId = async (farmerId: number) => {
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
      data: data?.data as ICaringTask[],
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};

export const getDetailCaringTasksById = async (id: number) => {
  try {
    const response = await instance.get('caring-tasks/' + id);
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as ICaringTask,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const putReportCaringTasksById = async (
  id: number,
  report: IReportCaringTask,
) => {
  try {
    const response = await instance.put('caring-tasks/' + id + '/report', {
      json: report,
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as ICaringTask,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const uploadCaringTaskImage = async (images: Asset[]) => {
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
    const response = await instance.post('caring-tasks/images/upload', {
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
