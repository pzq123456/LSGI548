import numpy as np
import os
import laspy
from pyproj import Transformer
from tqdm import tqdm

# 定义坐标系转换器（从 EPSG:2326 到 EPSG:4326）
transformer = Transformer.from_crs("EPSG:2326", "EPSG:4326", always_xy=True)

# 获取当前脚本所在目录
DIR = os.path.dirname(__file__)

# 定义 LAS 文件路径
PATH1 = os.path.join(DIR, 'download-107f0457-4942-4be5-bfa1-4094bc519b32', '2020', 'D5.Specified_Class', 'Building', '11NW25C(e836n818,e836n818).las')
PATH2 = os.path.join(DIR, 'download-107f0457-4942-4be5-bfa1-4094bc519b32', '2020', 'D5.Specified_Class', 'Ground', '11NW25C(e836n818,e836n818).las')
PATH3 = os.path.join(DIR, 'download-107f0457-4942-4be5-bfa1-4094bc519b32', '2020', 'D5.Specified_Class', 'Vegetation', '11NW25C(e836n818,e836n818).las')

def read_las(path):
    """
    读取 LAS 文件并返回点云数据（Nx3 的 numpy 数组）。
    """
    las = laspy.read(path)
    points = np.vstack([las.x, las.y, las.z]).transpose()
    return points

def downsample_points(points, ratio):
    """
    按给定的压缩率 ratio 进行点云抽稀。
    - ratio 取值范围 (0,1]，例如 0.5 表示保留 50% 的点。
    """
    if not (0 < ratio <= 1):
        raise ValueError("Compression ratio must be in the range (0, 1].")

    num_points = len(points)
    num_sample = int(num_points * ratio)
    
    # 随机选择点的索引
    sampled_indices = np.random.choice(num_points, num_sample, replace=False)
    return points[sampled_indices]

def transform_to_wgs84(points):
    """
    将点云数据从 EPSG:2326 转换为 WGS84（EPSG:4326），只转换 x, y，保持 z 不变。
    """
    points_wgs84 = np.zeros_like(points)
    for i, (x, y, z) in enumerate(tqdm(points, desc="Transforming coordinates")):
        points_wgs84[i, 0], points_wgs84[i, 1] = transformer.transform(x, y)  # 只转换 x, y
        points_wgs84[i, 2] = z  # 保持 z 不变
    return points_wgs84

def save_las(points, output_path):
    """
    将点云数据保存为 LAS 文件。
    """
    header = laspy.LasHeader(version="1.2", point_format=2)
    
    # 计算比例因子和偏移量
    min_coords = np.min(points, axis=0)
    max_coords = np.max(points, axis=0)
    
    header.scales = [0.0000001, 0.0000001, 0.01]  # WGS84 坐标需要更小的比例因子
    header.offsets = min_coords  # 使用最小坐标作为偏移量

    las = laspy.LasData(header)
    las.x = points[:, 0]
    las.y = points[:, 1]
    las.z = points[:, 2]

    las.write(output_path)
    print(f"Saved {len(points)} points to {output_path}")

def process_las_file(input_path, output_path, compression_ratio=1.0):
    """
    处理单个 LAS 文件：读取、抽稀、转换坐标系并保存。
    """
    points = read_las(input_path)
    print(f"Read {len(points)} points from {input_path}")

    # 抽稀点云
    points = downsample_points(points, compression_ratio)
    print(f"Downsampled to {len(points)} points (ratio={compression_ratio})")

    # 坐标转换
    points_wgs84 = transform_to_wgs84(points)
    print(f"Transformed {len(points_wgs84)} points to WGS84")

    # 保存转换后的点云
    save_las(points_wgs84, output_path)

if __name__ == "__main__":
    compression_ratio = 0.1  # 设定压缩率，例如 0.1 表示保留 10% 的点
    
    process_las_file(PATH1, os.path.join(DIR, "building_points_wgs84.las"), compression_ratio)
    process_las_file(PATH2, os.path.join(DIR, "ground_points_wgs84.las"), compression_ratio)
    process_las_file(PATH3, os.path.join(DIR, "vegetation_points_wgs84.las"), compression_ratio)
