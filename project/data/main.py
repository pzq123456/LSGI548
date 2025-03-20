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

def transform_to_wgs84(points):
    """
    将点云数据从 EPSG:2326 转换为 WGS84（EPSG:4326），只转换 x, y，保持 z 不变。
    """
    # 使用 tqdm 显示进度条
    points_wgs84 = np.zeros_like(points)
    for i, (x, y, z) in enumerate(tqdm(points, desc="Transforming coordinates")):
        points_wgs84[i, 0], points_wgs84[i, 1] = transformer.transform(x, y)  # 只转换 x, y
        points_wgs84[i, 2] = z  # 保持 z 不变
    return points_wgs84

def save_points(points, output_path):
    """
    将点云数据保存为 .npy 文件。
    """
    np.save(output_path, points)
    print(f"Saved transformed points to {output_path}")

def save_las(points, output_path):
    """
    将点云数据保存为 LAS 文件。
    """
    # 创建一个新的 LAS 文件头
    header = laspy.LasHeader(version="1.2", point_format=2)
    
    # 计算比例因子和偏移量
    min_coords = np.min(points, axis=0)
    max_coords = np.max(points, axis=0)
    
    # 设置比例因子和偏移量
    header.scales = [0.0000001, 0.0000001, 0.01]  # WGS84 坐标需要更小的比例因子
    header.offsets = min_coords  # 使用最小坐标作为偏移量

    # 创建 LAS 文件对象
    las = laspy.LasData(header)
    las.x = points[:, 0]
    las.y = points[:, 1]
    las.z = points[:, 2]

    # 保存 LAS 文件
    las.write(output_path)
    print(f"Saved transformed points to {output_path}")

def process_las_file(input_path, output_path):
    """
    处理单个 LAS 文件：读取、转换坐标系并保存。
    """
    # 读取 LAS 文件
    points = read_las(input_path)
    print(f"Read {len(points)} points from {input_path}")

    # 转换坐标系
    points_wgs84 = transform_to_wgs84(points)
    print(f"Transformed {len(points_wgs84)} points to WGS84")

    # 保存转换后的点云数据
    if output_path.endswith(".npy"):
        save_points(points_wgs84, output_path)
    elif output_path.endswith(".las"):
        save_las(points_wgs84, output_path)
    else:
        raise ValueError("Unsupported output format. Use .npy or .las")

if __name__ == "__main__":
    # 处理每个 LAS 文件
    process_las_file(PATH1, os.path.join(DIR, "building_points_wgs84.las"))
    process_las_file(PATH2, os.path.join(DIR, "ground_points_wgs84.las"))
    process_las_file(PATH3, os.path.join(DIR, "vegetation_points_wgs84.las"))