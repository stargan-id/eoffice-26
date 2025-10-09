import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { StatusAktif } from '@prisma/client';


async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data in proper order (respecting foreign key constraints)
  console.log('🧹 Cleaning existing data...');

  await db.userRole.deleteMany({});
  await db.rolePermission.deleteMany({});
  await db.roleExtension.deleteMany({});
  await db.userPreference.deleteMany({});
  await db.session.deleteMany({});
  await db.verificationToken.deleteMany({});
  await db.user.deleteMany({});
  await db.role.deleteMany({});
  await db.permission.deleteMany({});
  await db.organisasi.deleteMany({});

  // 1. Create Organizations
  console.log('🏢 Creating organizations...');

  const rootOrg = await db.organisasi.create({
    data: {
      nama: 'Kementerian Kesehatan RI',
      singkatan: 'KEMENKES',
      status: StatusAktif.AKTIF,
      tingkat: 1,
      createdBy: 'system',
    },
  });

  const dirjenOrg = await db.organisasi.create({
    data: {
      nama: 'Direktorat Jenderal Kesehatan Masyarakat',
      singkatan: 'DITJEN KESMAS',
      status: StatusAktif.AKTIF,
      tingkat: 2,
      indukOrganisasiId: rootOrg.id,
      createdBy: 'system',
    },
  });

  const dirGiziOrg = await db.organisasi.create({
    data: {
      nama: 'Direktorat Gizi dan Kesehatan Ibu Anak',
      singkatan: 'DIT GIZI KIA',
      status: StatusAktif.AKTIF,
      tingkat: 3,
      indukOrganisasiId: dirjenOrg.id,
      createdBy: 'system',
    },
  });

  const dinkesOrg = await db.organisasi.create({
    data: {
      nama: 'Dinas Kesehatan DKI Jakarta',
      singkatan: 'DINKES DKI',
      status: StatusAktif.AKTIF,
      tingkat: 3,
      indukOrganisasiId: rootOrg.id,
      createdBy: 'system',
    },
  });

  // 2. Create Permissions
  console.log('🔐 Creating permissions...');
  
  const permissions = [
    // User management
    { name: 'user.create', resource: 'user', action: 'create', description: 'Create new users' },
    { name: 'user.read', resource: 'user', action: 'read', description: 'View user information' },
    { name: 'user.update', resource: 'user', action: 'update', description: 'Update user information' },
    { name: 'user.delete', resource: 'user', action: 'delete', description: 'Delete users' },
    
    // Role management
    { name: 'role.create', resource: 'role', action: 'create', description: 'Create new roles' },
    { name: 'role.read', resource: 'role', action: 'read', description: 'View roles' },
    { name: 'role.update', resource: 'role', action: 'update', description: 'Update roles' },
    { name: 'role.delete', resource: 'role', action: 'delete', description: 'Delete roles' },
    
    // Permission management
    { name: 'permission.create', resource: 'permission', action: 'create', description: 'Create permissions' },
    { name: 'permission.read', resource: 'permission', action: 'read', description: 'View permissions' },
    { name: 'permission.update', resource: 'permission', action: 'update', description: 'Update permissions' },
    { name: 'permission.delete', resource: 'permission', action: 'delete', description: 'Delete permissions' },
    
    // Organization management
    { name: 'organization.create', resource: 'organization', action: 'create', description: 'Create organizations' },
    { name: 'organization.read', resource: 'organization', action: 'read', description: 'View organizations' },
    { name: 'organization.update', resource: 'organization', action: 'update', description: 'Update organizations' },
    { name: 'organization.delete', resource: 'organization', action: 'delete', description: 'Delete organizations' },
    
    // Dashboard access
    { name: 'dashboard.admin', resource: 'dashboard-admin', action: 'read', description: 'Access admin dashboard' },
    { name: 'dashboard.user', resource: 'dashboard-user', action: 'read', description: 'Access user dashboard' },

    // Nutrition data management
    { name: 'nutrition.create', resource: 'nutrition', action: 'create', description: 'Create nutrition data' },
    { name: 'nutrition.read', resource: 'nutrition', action: 'read', description: 'View nutrition data' },
    { name: 'nutrition.update', resource: 'nutrition', action: 'update', description: 'Update nutrition data' },
    { name: 'nutrition.delete', resource: 'nutrition', action: 'delete', description: 'Delete nutrition data' },
    
    // Reports
    { name: 'report.generate', resource: 'report', action: 'create', description: 'Generate reports' },
    { name: 'report.view', resource: 'report', action: 'read', description: 'View reports' },
    { name: 'report.export', resource: 'report', action: 'export', description: 'Export reports' },
  ];

  const createdPermissions = await Promise.all(
    permissions.map((permission) =>
      db.permission.create({
        data: {
          ...permission,
          createdBy: 'system',
        },
      })
    )
  );

  // 3. Create Roles
  console.log('👥 Creating roles...');
  
  const superAdminRole = await db.role.create({
    data: {
      name: 'Super Admin',
      description: 'Full system access and administration rights',
      createdBy: 'system',
    },
  });

  const adminRole = await db.role.create({
    data: {
      name: 'Admin',
      description: 'Administrative access with some restrictions',
      createdBy: 'system',
    },
  });

  const managerRole = await db.role.create({
    data: {
      name: 'Manager',
      description: 'Management level access for nutrition programs',
      createdBy: 'system',
    },
  });

  const operatorRole = await db.role.create({
    data: {
      name: 'Operator',
      description: 'Operational level access for data entry and viewing',
      createdBy: 'system',
    },
  });

  const userRole = await db.role.create({
    data: {
      name: 'User',
      description: 'Basic user access for viewing assigned data',
      createdBy: 'system',
    },
  });

  // 4. Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...');
  
  // Super Admin - All permissions
  await Promise.all(
    createdPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Admin - Most permissions except super admin functions
  const adminPermissions = createdPermissions.filter(p => 
    !p.name.includes('permission') && !p.name.includes('role.delete')
  );
  await Promise.all(
    adminPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Manager - Data management and reports
  const managerPermissions = createdPermissions.filter(p => 
    p.name.includes('nutrition') || 
    p.name.includes('report') || 
    p.name.includes('organization.read') ||
    p.name.includes('user.read') ||
    p.name.includes('dashboard')
  );
  await Promise.all(
    managerPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Operator - Basic CRUD for nutrition data
  const operatorPermissions = createdPermissions.filter(p => 
    p.name.includes('nutrition') || 
    p.name.includes('report.view') ||
    p.name.includes('dashboard.user') ||
    p.name.includes('organization.read')
  );
  await Promise.all(
    operatorPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: operatorRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // User - Read only access
  const readOnlyPermissions = createdPermissions.filter(p => 
    p.action === 'read' && (
      p.name.includes('nutrition.read') || 
      p.name.includes('report.view') ||
      p.name.includes('dashboard.user')
    )
  );
  await Promise.all(
    readOnlyPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // 5. Create Users
  console.log('👤 Creating users...');
  
  const hashedPassword = await bcrypt.hash('Admin@123!', 12);
  
  const superAdmin = await db.user.create({
    data: {
      name: 'Super Administrator',
      email: 'superadmin@stargan.id',
      password: hashedPassword,
      NIP: '198001012005011001',
      organisasiId: rootOrg.id,
      createdBy: 'system',
    },
  });

  const admin = await db.user.create({
    data: {
      name: 'Administrator Gizi',
      email: 'admin@stargan.id',
      password: hashedPassword,
      NIP: '198505152010012002',
      organisasiId: dirGiziOrg.id,
      createdBy: 'system',
    },
  });

  const manager = await db.user.create({
    data: {
      name: 'Manager Program Gizi',
      email: 'manager@stargan.id',
      password: hashedPassword,
      NIP: '199001012015022001',
      organisasiId: dirGiziOrg.id,
      createdBy: 'system',
    },
  });

  const operator = await db.user.create({
    data: {
      name: 'Operator Data Gizi',
      email: 'operator@stargan.id',
      password: hashedPassword,
      NIP: '199505052018032001',
      organisasiId: dinkesOrg.id,
      createdBy: 'system',
    },
  });

  const regularUser = await db.user.create({
    data: {
      name: 'Petugas Gizi Puskesmas',
      email: 'user@stargan.id',
      password: hashedPassword,
      NIP: '200001012023012001',
      organisasiId: dinkesOrg.id,
      createdBy: 'system',
    },
  });

  // 6. Assign roles to users
  console.log('🎭 Assigning roles to users...');
  
  await db.userRole.create({
    data: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: manager.id,
      roleId: managerRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: operator.id,
      roleId: operatorRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: regularUser.id,
      roleId: userRole.id,
    },
  });

  // 7. Create user preferences
  console.log('⚙️ Creating user preferences...');
  
  const userPreferences = [
    {
      id: superAdmin.id,
      tema: 'dark',
      bahasa: 'id',
      detil: {
        sidebar: 'expanded',
        notifications: true,
        autoSave: true,
      },
    },
    {
      id: admin.id,
      tema: 'light',
      bahasa: 'id',
      detil: {
        sidebar: 'collapsed',
        notifications: true,
        autoSave: false,
      },
    },
    {
      id: manager.id,
      tema: 'light',
      bahasa: 'id',
      detil: {
        sidebar: 'expanded',
        notifications: false,
        autoSave: true,
      },
    },
    {
      id: operator.id,
      tema: 'system',
      bahasa: 'id',
      detil: {
        sidebar: 'collapsed',
        notifications: true,
        autoSave: true,
      },
    },
    {
      id: regularUser.id,
      tema: 'light',
      bahasa: 'id',
      detil: {
        sidebar: 'auto',
        notifications: false,
        autoSave: false,
      },
    },
  ];

  await Promise.all(
    userPreferences.map((pref) =>
      db.userPreference.create({
        data: pref,
      })
    )
  );

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Created:');
  console.log(`   • ${await db.organisasi.count()} Organizations`);
  console.log(`   • ${await db.permission.count()} Permissions`);
  console.log(`   • ${await db.role.count()} Roles`);
  console.log(`   • ${await db.user.count()} Users`);
  console.log(`   • ${await db.rolePermission.count()} Role-Permission assignments`);
  console.log(`   • ${await db.userRole.count()} User-Role assignments`);
  console.log(`   • ${await db.userPreference.count()} User preferences`);
  
  console.log('\n👤 Default Users Created:');
  console.log('   • superadmin@stargan.id (Super Admin) - Password: Admin@123!');
  console.log('   • admin@stargan.id (Admin) - Password: Admin@123!');
  console.log('   • manager@stargan.id (Manager) - Password: Admin@123!');
  console.log('   • operator@stargan.id (Operator) - Password: Admin@123!');
  console.log('   • user@stargan.id (User) - Password: Admin@123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });