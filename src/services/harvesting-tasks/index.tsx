import { Asset } from 'react-native-image-picker';
import { IHarvestingTask, IReportHarvestingTask } from 'src/interfaces';

import { instance, IResponse } from '../instance';

export const getHarvestingTasksByFarmerId = async (farmerId: number) => {
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
      data: data?.data as IHarvestingTask[],
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};

export const getDetailHarvestingTasksById = async (id: number) => {
  try {
    const response = await instance.get('harvesting-tasks/' + id);
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IHarvestingTask,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const putReportHarvestingTasksById = async (
  id: number,
  report: IReportHarvestingTask,
) => {
  try {
    const response = await instance.put('harvesting-tasks/' + id + '/report', {
      json: report,
    });
    const data: IResponse = await response.json();
    return {
      message: data?.message,
      status: data?.status,
      data: data?.data as IHarvestingTask,
    };
  } catch (error) {
    return {
      message: error,
      status: 500,
      data: null,
    };
  }
};
export const uploadHarvestingTaskImage = async (images: Asset[]) => {
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
    const response = await instance.post('harvesting-tasks/images/upload', {
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
