---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "PolyU Point Cloud Map"
  tagline: "Constructing a 3D Virtual Campus Environment by Leveraging LiDAR and Remote Sensing Technologies: Methodology and Case Study at PolyU"
  image:
    src: /logo.png  
    alt: PolyU Point Cloud Map  
    style: "border-radius: 50%; width: 200px; height: 200px;"
  actions:
    - theme: brand
      text: demo
      link: /dev

---

## Our Team

Say hello to our team members. 

<VPTeamMembers size="medium" :members="members" />


<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    id: '24054237G',
    avatar: 'Liang Yu.jpg', // 可后续补充头像URL
    name: 'Liang Yu',
    title: 'Research Lead & Literature Review',
    coreResponsibilities: ['Research Design', 'Literature Review', 'Theoretical Framework'],
    links: []
  },
  {
    id: '24049994G',
    avatar: 'Yao Zhiwen.jpg',
    name: 'Yao Zhiwen',
    title: 'Data Acquisition & Methodology',
    coreResponsibilities: ['LiDAR Data', 'Remote Sensing', 'Data Processing'],
    links: []
  },
  {
    id: '24084485G',
    avatar: 'Li Kexuan.jpg',
    name: 'Li Kexuan',
    title: '3D Modeling Visualization & Methodology',
    coreResponsibilities: ['3D Modeling', 'Visualization', 'Quality Control'],
    links: []
  },
  {
    id: '24114611G',
    avatar: 'Zeng Jianwen.jpg',
    name: 'Zeng Jianwen',
    title: 'Point Cloud Specialist & Model Construction & Development',
    coreResponsibilities: ['Point Cloud Processing', 'Data Classification', 'Model Construction'],
    links: []
  },
  {
    id: '24037665G',
    avatar: 'https://avatars.githubusercontent.com/u/82391775?v=4',
    name: 'Pan Zhiqing',
    title: 'Hybrid Layer Developer & Application Scenarios',
    coreResponsibilities: ['Hybrid-Layer Tech', 'Application Scenarios', 'Model Refinement'],
    links: []
  },
  {
    id: '24077272G',
    avatar: 'Zou Guohao.jpg',
    name: 'Zou Guohao',
    title: 'Future Vision Director & Disscussion & Group Management',
    coreResponsibilities: ['Strategic Planning', 'Future Work', 'Application Development'],
    links: []
  }
]
</script>

