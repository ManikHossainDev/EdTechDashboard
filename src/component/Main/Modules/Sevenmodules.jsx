import { useState, useEffect } from "react";
import {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
  useUploadContentImageMutation,
  useUploadIntroVideoOrCoverImageMutation,
} from "../../../redux/features/modules/modulesGet";

const Sevenmodules = () => {
  // module id seven
  const id = "693670abf4d0d2d1e21e1d6d";
  const { data, isLoading, isError, error } = useGetModulesByIdQuery(id);
  console.log(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleOne] = useUpdateModulesOneMutation();
  const [uploadGenImage] = useUploadContentImageMutation();
  const [uploadIntroVideo] = useUploadIntroVideoOrCoverImageMutation();
  return <div>Seven modules</div>;
};

export default Sevenmodules;
