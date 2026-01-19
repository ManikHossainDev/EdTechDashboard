import { useState, useEffect } from "react";
import {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
  useUploadContentImageMutation,
  useUploadIntroVideoOrCoverImageMutation,
} from "../../../redux/features/modules/modulesGet";

const Sixmodules = () => {
  // module id six
  const id = "69366f0df4d0d2d1e21e1d67";
  const { data, isLoading, isError, error } = useGetModulesByIdQuery(id);
  console.log(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateModuleOne] = useUpdateModulesOneMutation();
  const [uploadGenImage] = useUploadContentImageMutation();
  const [uploadIntroVideo] = useUploadIntroVideoOrCoverImageMutation();

  // Render the form
  return <div>Six modules</div>;
};

export default Sixmodules;
