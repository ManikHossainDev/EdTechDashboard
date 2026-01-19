import { useState, useEffect } from "react";
import {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
  useUploadContentImageMutation,
  useUploadIntroVideoOrCoverImageMutation,
} from "../../../redux/features/modules/modulesGet";

const Eightmodules = () => {
  // module id eight
  const id = "6936776976dca28d7e43e6c7";
  const { data, isLoading, isError, error } = useGetModulesByIdQuery(id);
  console.log(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleOne] = useUpdateModulesOneMutation();
  const [uploadGenImage] = useUploadContentImageMutation();
  const [uploadIntroVideo] = useUploadIntroVideoOrCoverImageMutation();
  return <div>Eight modules</div>;
};

export default Eightmodules;
