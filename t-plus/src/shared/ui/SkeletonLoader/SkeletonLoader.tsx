import { FC } from "react";
import Skeleton, { SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CustomSkeletonProps extends SkeletonProps {
  width: string;
  height: string;
}

const SkeletonLoader: FC<CustomSkeletonProps> = ({ width, height, ...rest }) => {
  return (
    <Skeleton
      {...rest}
      baseColor="#FFBF00"
      highlightColor="#292A2E"
      style={{ width, height }}
    />
  );
};

export default SkeletonLoader;