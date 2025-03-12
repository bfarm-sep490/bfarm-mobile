import { Key } from 'react';

export interface IProblem {
  id: Key;
  problem_name: string;
  description?: string;
  problem_type: string;
  date: Date;
  status: string;
  plan_id: number;
  result_content?: string;
  problem_images?: IProblemImage[];
}
export interface ICreateProblem {
  id: Key;
  problem_name: string;
  description?: string;
  problem_type: string;
  date: Date;
  status: string;
  plan_id: number;
  result_content?: string;
  problem_images?: string[];
}

export interface ISelectPlan {
  id: Key;
  plan_name: string;
}

export interface IProblemImage {
  image_id: Key;
  url: string;
}

export interface IPackagingTask {
  task_id: number;
  task_name: string;
  plan_id: number;
  description: string;
  start_date: Date;
  end_date: Date;
  packaged_unit: string;
  packaged_quantity: number;
  unpackaged_quantity: number;
  unpackaged_unit: string;
  result_content: string;
  complete_date: Date;
  status: string;
  farmer_id: number;
  create_at: Date;
  update_at: Date;
  list_of_images?: IImage[];
}
export interface IImage {
  image_id: Key;
  image_url: string;
}
export interface IHarvestingTask {
  task_id: number;
  task_name: string;
  plan_id: number;
  description: string;
  start_date: Date;
  end_date: Date;
  result_content: string;
  complete_date: Date;
  harvested_quantity: number;
  harvested_unit: string;
  status: string;
  farmer_id: number;
  create_at: Date;
  update_at: Date;
  list_of_images?: IImage[];
}
export interface ICaringTask {
  task_id: number;
  task_name: string;
  plan_id: number;
  description: string;
  task_type: string;
  start_date: Date;
  end_date: Date;
  result_content: string;
  complete_date: Date;
  status: string;
  farmer_id: number;
  create_at: Date;
  update_at: Date;
  list_of_images?: IImage[];
}
export interface IReportCaringTask {
  result_content: string;
  list_of_images: string[];
}

export interface IReportHarvestingTask {
  result_content: string;
  harvesting_quantity: number;
  harvesting_unit: string;
  list_of_images: string[];
}

export interface IReportPackagingTask {
  result_content: string;
  packaged_quantity: number;
  packaged_unit: string;
  unpackaged_quantity: number;
  unpackaged_unit: string;
  list_of_images: string[];
}
