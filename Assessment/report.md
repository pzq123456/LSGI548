---
bibliography: references.bib
---

# Surface Modeling Techniques for Point Clouds Collected by Laser Scanners
> - PANZhiqing 24037665G

## 1. Introduction

Laser Scanning 是一种新型测绘技术，可以在极短的时间内获取大量带有高精度三维坐标的数据点（point clouds），一般情况下能够达到0.4 到 5.4 MB/hectare，因此也被认为是一种大数据生产工具[@s18051641]。 我们可以从 Laser 光源特性、搭载平台、目标应用等角度对 Laser Scanning 系统进行粗略分类。举例来说，对于较大规模的城市场景进行测绘及建模，我们可以使用较强的激光光源结合机载激光扫描系统（ALS）并结合 GPS/IMU 定位技术来获取所需的点云数据；而对于一些小尺度的室内场景，我们可以使用激光光源较弱的（人眼友好型）手持激光扫描设备（MLS）来获取点云数据。

![Figure 1.1 Differnt Laser Scanning Systems.](./imgs/1.1.png)

![Figure 1.2 Different Laser Scanning Platforms.](./imgs/1.2.png)

> a) Terrestrial Laser Scanning (TLS) b) Airborne Laser Scanning (ALS) c) Mobile Laser Scanning (MLS)

点云数据（常见的三维几何数据格式）仅仅是一些列带有坐标信息的点，是一种非结构化的数据结构。这种非结构化的数据应用场景有限，例如不能做进一步的物理模拟（诸如流场模拟、碰撞检测）等。在计算机科学及其他一些工程领域，需要一种连续的表面表示来描述物体或场景（三角网格、参数化曲面）。点云数据的表面重建是一个非常重要的研究方向，它可以将点云数据转换为连续的表面表示，从而可以应用到更多的领域中。

### 1.1 点云数据特征及组织形式

激光扫描技术通过非接触式采集方式生成大量点云数据，每个点云数据不仅包含空间坐标信息（x, y, z），还可能根据扫描系统的原理附加不同的属性信息[@9359340]。例如，基于激光原理的扫描系统会在点云中加入激光反射强度（Intensity）或是记录到的反射次数，而基于摄像头原理的系统则会附加颜色信息（RGB）。许多3D扫描仪综合了激光和摄像头技术，能够在近距离扫描物体时同时获取高精度的空间坐标、反射强度、颜色信息和语言信息，从而生成包含多维属性的点云数据。此外，得益于“非接触式”测量特性及灵活的搭载平台，激光扫描技术还十分的灵活--从精细文物建模[@ijgi10090617]到公里级地形测绘及城市建模[@8253517]均可有效覆盖。点云数据的存储格式多样，常见的包括`.las`、`.laz`（LiDAR数据的工业标准格式）、`.pcd`（PCL库指定格式）、`.obj`（3D模型文件格式）、`.pts`（仅包含坐标信息的简便格式）以及`.xyz`和`.txt`等文本格式。

点云数据在具体应用中具有高度灵活性，例如可以直接以三维的方式呈现搜集到的信息，若再附加纹理信息其可视化效果并不比三角网格差，同时，带有多维属性的点云数据也比一般的三维网格具有更高的信息量。然而，点云数据对于物体或场景的几何信息表达是“原始的”（非结构化的），这种“原始的（相对于三角网格等数据结构而言）”数据结构存在存在诸多潜在的问题。例如，点云数据存在稀疏性问题，即空间分布不均匀，一些地方过分稠密（例如植被区域），而另一些地方则过分稀疏（例如遮挡区域）；点云数据容易受到噪声的干扰，空气湍流、植被遮挡、地面反射等因素都会导致点云数据的质量下降；更为复杂的是，点云数据还面临数据冗余（如植被区域的多次回波）与数据缺失（如遮挡区域）的共存矛盾。若希望进一步分析处理点云数据，就不得不使用特定的预处理算法来处理存在噪声、稀疏性等问题的点云数据，而后再进行表面重建等操作。

考虑到原始点云通常是无结构的，这使得点云的处理和分析变得复杂。如果能采用特定的数据结构恢复测量点的局部几何和空间拓扑，将有助于提高数据处理的效率和性能。这类“优化的”点云数据组织形式可以看作是一种“中间表达”，它在保留原始点云信息的同时，提供了更多的几何和拓扑信息，为后续分析及具体应用提供便利。常见的点云数据结构包括基于点的数据结构、基于体素（Voxel）的数据结构和基于Patch的组织方式。[@9359340]

最原始的点云数据就是无结构的三维点集合，即非结构化点云。这种数据结构简单直观，但在处理时需要遍历整个点列表来确定点之间的邻接关系，计算成本较高。可以基于固定的栅格或三维网格来组织点云，捕捉点间拓扑结构，形成结构化点云，以便加速最邻近查找等计算过程，加速后续计算处理。

与二维图像中的像素相类似，体素是（某些算法概念中）三维世界中的最小组成单元。体素化本质上是一种降采样，即通过一个个固定大小的体素来近似表示原始点云（不论单个体素内有多少点）。常用八叉树组织体素，通过递归划分空间，每个体素的大小随着层级变化而调整。体素化可以简化复杂场景的表示，减少计算成本。八叉树的最大深度和体素大小是体素化的两个重要参数，需要根据具体应用场景进行合理选择。

基于Patch的数据结构是一种介于点云和体素之间的中间表达形式，它是一种基于聚类与点云空间分布特征识别的数据组织形式，往往一定程度上暗示了局部点云的语言信息。Patch可以是超体素（Supervoxel）或超点（Superpoint），它们是对点云的过分割，通过聚类将具有相似特征的点组织为补丁，以补丁作为基本单元进行进一步处理。超体素可以更好地保持邻近实体之间的边界，提高计算效率。然而，超体素仅是对整个点云的过分割，需要进行二次聚类以获得完整的分割结果。

### 1.2 表面表示方法

在数字地理学科中，表面模型大致可以分为三类：三角网格模型（Triangulated Irregular Network, TIN）、栅格模型（Grid）和隐式模型（Implicit Model）。这三种模型各有优劣，适用于不同的应用场景 [@Caumon2009]。

![Figure 1.3 Surface Representation Methods.](./imgs/1.3.png)

三角网格模型的核心思想是使用无数细小的三角面片去逼近真实曲面。这种方法适用于处理不规则分布的数据点，但在处理大规模数据时效率较低。三角网格模型通过顶点、边和面来表示物体的表面，每个面通常是三角形或四边形，适用于大多数图形应用。然而，尽管三角网格模型在表示复杂几何形状时具有较高的灵活性，但其在处理大规模数据时可能会面临计算效率的挑战。栅格模型的核心思想是将三维空间划分为一个个小的立方体（体素），每个体素包含表面信息。这种方法适用于规则分布的数据点，广泛应用于医学成像和地质建模等领域。然而，栅格模型在处理复杂结构时可能会面临精度不足的问题，尤其是在需要高分辨率表示的场景中。隐式模型通过数学方程定义曲面，适用于处理复杂的拓扑结构，如自相交或多重连接的表面。隐式模型的核心思想是使用一个隐式函数来表示曲面，这种方法在处理复杂结构时表现出色。

近年来，隐式表面模型进一步发展，使用神经网络来表示曲面，这种方法被称为神经表面模型。神经表面模型的优点是可以很容易地表示复杂的几何形状，但其缺点是需要大量的训练数据，并且由于其复杂性，难以解释和调整 [@wang2021a]。

在计算机图形学和材料科学中，表面模型和表面表示方法同样是用于描述和分析物体表面形态和性质的关键概念。除了上述三类模型，NURBS（Non-Uniform Rational B-Splines）也是一种常见的表面表示方法。NURBS 使用有理 B 样条函数来表示曲线和曲面，能够精确描述复杂的自由形状，广泛应用于 CAD 系统中。此外，参数化模型通过参数化方程描述表面，常用于曲面建模，适用于需要精确控制曲面形状的场景。

通常，要求重建后的三维表面具有如下优良特性：1）高分辨率和光滑；2）无缝隙；3）与可能的真实数据一致；4）对噪声或不完整输入具有鲁棒性；5）同时具有密集和压缩的表示。这些要求也是表面重建方法的评价标准 [@10301359]。

## 2. Methods and Techniques for Point Cloud Surface Modeling

### 2.1 经典方法：从几何驱动到数据驱动

从点云重建曲面是指创建一个连续的曲面以使其近似于从中采样三维点的原始曲面[@10777531]，即将三维点云数据（最常见的真实世界三维数据格式）转换为其他形状表示（如网格或隐函数）的过程，以供后续应用使用（如渲染、仿真、几何处理）。

#### 2.1.1 网格化方法（Marching Cubes）
基于曲面的方法通常直接生成网格，例如通过对 \( \Omega \) 进行三角剖分。相比之下，基于体积的方法通常需要额外的处理步骤。如果隐式场使用三维 Delaunay 四面体剖分（3DT）离散化为四面体，则可以从所有与一个内部四面体和一个外部四面体相邻的三角形构建网格。

从隐式场提取网格的最流行方法之一是 Marching Cubes，它将隐式函数离散化为体素，以一个表示离散隐式场的均匀网格值作为输入，并提取表示该场零等值面的三角网格，最终提取所有三角形的并集作为重建曲面（mesh）。经典的 Marching Cubes 算法通过检查网格中每个立方体八个顶点的符号，并参考一个预定义的查找表（按符号配置索引）来确定局部网格拓扑结构和镶嵌方式。如果等值面与立方体的某个边相交，就会在该边上添加一个新的网格顶点，并通过线性插值计算其位置。然而，Marching Cubes 算法无法有效利用邻居信息，因此它无法有效恢复尖锐特征。最近，Marching Cubes 的神经网络优化变体[@3480518]通过重新设计镶嵌模板，使其更适合保留几何特征（包括尖锐边缘和角点），并开发了一个神经网络来从训练数据中学习顶点位置和网格拓扑，以考虑来自邻近立方体的上下文信息。该算法可以有效地恢复尖锐特征。

#### 2.1.2 基于体积的方法（泊松表面重建）

这些方法将 \( \mathbb{R}^3 \) 的一个子集划分为内部（内部）和外部（外部）子空间。曲面被隐式定义为这两个子空间之间的界面。大多数（但不是全部）此类算法将问题表述为找到一个隐式函数，指示空间中的点是满的（内部）还是空的（外部）。使用基于体积的方法重建的曲面保证是封闭且无自交的。

泊松表面重建（Poisson Surface Reconstruction, PSR），该方法通过求解偏微分方程来重建隐函数[@1281965]。该方法使用自适应分辨率八叉树来表示代表目标表面模型的隐式表达。这种结构在模型表面附近具有高分辨率，而在远离表面处具有较低分辨率。这使得该算法能够在保持高分辨率的同时，保持较低的计算成本。PSR 通过求解泊松方程来重建隐式函数，该方程的解是一个光滑的曲面，可以通过等值面提取算法来提取三角网格。

然而，泊松表面重建算法缺少重建的结果精度评价指标，难以量化重建过程中的不确定性，这个问题从一定程度上降低了该方法的可靠性。基于高斯过程（Gaussian Process, GP） 的统计推导，可分析出泊松表面重建过程中表面形状的不确定性信息。这种方法被称为随机泊松表面重建（Stochastic Poisson Surface Reconstruction, SPSR）[@3555441]。

### 2.2 算法革新：智能化与自动化

相较于传统算法需要人工干预的表面重建方法，深度学习技术往往采用“端到端”学习的方式，直接从原始数据中学习特征，提高数据处理效率。同时，对于一些复杂情况，基于深度学习的方法也表现出优异的定量和定性性能。[@10301359]

PointNet [@qi2017pointnetdeeplearningpoint] 是首个直接处理无序点云的端到端深度学习框架，该框架直接处理原始点云，保留几何细节，避免预先体素化或投影导致的几何信息损失。通过对称函数（如最大池化）聚合点特征，保持置换不变性，无需手工提取特征。PointNet 网络由分类网络和分割网络组成，该网络接受n个无序点$P = \{p_1, p_2, \ldots, p_n\}$作为输入，输出为每个点的分类分数或分割分数。该网络采用跳跃连接和特征变换网络，通过多尺度特征学习捕捉局部和全局信息，对点云密度不均、噪声和遮挡具有较强适应性，适用于大范围ALS点云的高效处理。

![Figure 2.1 PointNet Architecture.](./imgs/2.1.png)

PointNet++ [@rs13030472] 则是在 PointNet 基础上引入层次化结构，通过多尺度特征学习（采样层、分组层、PointNet 层）捕捉局部和全局信息，此外，在特征传播中，该模型结合点间距离和高程差异进行插值，利用ALS点云的高程分布特性优化分类结果。其通过多尺度局部特征和全局特征的结合，支持复杂场景（如城市建筑、植被）的语义分割和对象识别，为后续重建提供高精度分类结果。

![Figure 2.2 PointNet++ Architecture.](./imgs/2.2.png)

此外，也可使用神经网络来表示隐式曲面。NeRF [@wang2021a] 是一种通过学习多角度图片来生成所观察场景的隐式表达的方法，它可以生成逼真的三维场景。与严格意义上的表面重建不同，NeRF 可以认为是一种“神经渲染”技术，它并不仅仅学习隐式表面函数，还一同学习了场景的辐射传输方程。NeRF 网络可以与 LiDAR 点云相结合，重建三维场景，助力提高后续表面重建的质量。[@Zhang_Zhang_Kuang_Zhang_2024]

## 3. Application Scenarios and Technical Demands
> 应用场景驱动的技术差异化需求

### 3.1 自然环境建模

Lidar点云可以用于自然环境建模，例如植被建模、自然地形建模等。而植被建模又可以细分出树木建模、灌木建模等。树木建模主要用于森林管理领域，3D树木模型被广泛用于可视化增强和树木特性预测。在树木点云建模中程序化方法（如L系统）是一种有趣的数目建模方法，通过模拟树木生长规律生成树木模型。此外还可以基于图像识别和扫描获取树木模型。[@8253517]

Lidar point clouds can be used for natural environment modeling, such as vegetation modeling, natural terrain modeling, etc. Vegetation modeling can be further subdivided into tree modeling, shrub modeling, etc. Tree modeling is mainly used in the field of forest management, and 3D tree models are widely used for visualization enhancement and tree characteristic prediction. In tree point cloud modeling, procedural methods (such as L-systems) are an interesting numerical modeling method that generates tree models by simulating tree growth rules. In addition, tree models can be obtained based on image recognition and scanning. [@8253517]

一般而言，在进行树木建模之前，通常需要进行植被检测和单棵树分割，而后需要进行点云骨架化、几何/拓扑推断、添加叶子和细枝（通常使用L系统）等步骤。树木骨架结构的重建方法主要有体积方法、K均值聚类及圆柱拟合、全局优化及Laplacian平滑等。

Generally speaking, before tree modeling, vegetation detection and single tree segmentation are usually required, and then point cloud skeletonization, geometric/topological inference, adding leaves and twigs (usually using L-systems), etc. are required. The reconstruction methods of tree skeleton structure mainly include volume method, K-means clustering and cylinder fitting, global optimization and Laplacian smoothing, etc.

考虑到自然表面一般具有复杂的几何特征，例如尖锐边缘、粗糙表面等，这类特征往往难以使用数学方式表达，更加难以建模与分析。因此，基于深度学习的方法在自然环境建模中具有广泛的应用前景。例如，PointNet++ 可以用于复杂自然场景的点云进行分割建模，NeRF 可以用于重现逼真的场景影响。此外，基于深度学习的方法还可以用于植被检测、植被分割、植被分类等任务。在复杂场景下，相比于传统算法，深度学习方法具有一定的优势。

Given that natural surfaces generally have complex geometric features, such as sharp edges, rough surfaces, etc., these features are often difficult to express mathematically and even more difficult to model and analyze. Therefore, deep learning-based methods have broad application prospects in natural environment modeling. For example, PointNet++ can be used for segmentation modeling of point clouds in complex natural scenes, and NeRF can be used to reproduce realistic scene effects. In addition, deep learning-based methods can also be used for vegetation detection, vegetation segmentation, vegetation classification, etc. In complex scenes, deep learning methods have certain advantages over traditional algorithms.

### 3.2 城市与建筑数字化
   - 建筑立面重建：平面拟合+RANSAC算法提取规则结构，结合BIM实现语义化建模。
   - 城市级建模瓶颈：亿级点云的实时渲染难题，LOD（细节层次）技术与云计算的结合策略。

### 3.3 文化遗产与虚拟现实
   - 高保真重建：亚毫米级扫描结合纹理映射，实现石窟壁画的数字修复。
   - VR/AR适配：轻量化网格与法线贴图生成，平衡沉浸感与计算负载。

   跨领域启示：  
   > 建筑领域的规则驱动建模（如基于IFC标准）可为自然场景建模提供结构化先验知识，而文化遗产的高精度要求推动硬件（如光谱LiDAR）与算法（如超分辨率重建）的协同创新。

## 4. Discussion

可以发现点云数据的复杂性不光来自于自身数量巨大、维度高、非结构化等的特点，还来自于其应用场景与细分领域的多样性。在不同的应用场景下，点云数据的处理方法、表面重建技术、算法优化等都有所不同。可以说，点云数据的处理与表面重建是一个多学科交叉的研究领域，需要结合计算机科学、地理信息科学、建筑学、文化遗产保护等多个领域的知识。因此，未来的研究方向应该是多学科交叉的，需要结合不同领域的专家，共同推动点云数据处理与表面重建技术的发展。

## References