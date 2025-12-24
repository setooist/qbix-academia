# RBAC System Setup Guide

## Overview

The RBAC system has been successfully implemented with the following components:

### Database Structure

1. **Roles** (stored in `member_roles` table)
   - Admin (Level 100) - Full system access
   - Content Manager (Level 80) - Content management
   - Activity Manager (Level 80) - Activity management
   - Event Manager (Level 80) - Event management
   - Mentor/Faculty (Level 50) - Review and feedback
   - Partner (Level 30) - Limited resource access
   - Student (Level 10) - Basic content access

2. **Permissions** (stored in `permissions` table)
   - Granular permissions for different resources
   - Format: `resource.action` (e.g., `content.create`, `users.manage`)
   - Resources: content, users, activities, events, settings, roles, tiers

3. **Role Permissions** (stored in `role_permissions` table)
   - Maps permissions to roles
   - Admins have all permissions
   - Other roles have specific permission sets

4. **Member Tiers** (stored in `member_tiers` table)
   - Tier A - Premium access
   - Tier B - Standard access
   - Tier C - Basic access

### Admin Panel

The admin panel is accessible at `/admin` and includes:

1. **Dashboard** - Overview of admin functions
2. **User Management** - Manage users, assign roles and tiers
3. **Role Management** - Configure roles and permissions
4. **Content Management** - Coming soon
5. **Event Management** - Coming soon
6. **Activity Management** - Coming soon
7. **System Settings** - Coming soon

### Access Control

- Staff members (Admin, Content Manager, Activity Manager, Event Manager) have access to the admin panel
- Admin link appears in the navigation dropdown for staff users
- All admin pages are protected with permission checks
- Unauthorized users are redirected to the home page

## Admin Credentials

To create the admin user, you need to:

1. Sign up through the application at `/auth/signup`
2. Use the following credentials or your own:
   - Email: `admin@qbixacademia.com`
   - Password: Choose a secure password

3. After signing up, run the following SQL in the Supabase SQL Editor to assign admin role:

```sql
-- Get the admin role ID
DO $$
DECLARE
  admin_role_id uuid;
  user_email text := 'admin@qbixacademia.com'; -- Replace with your email
BEGIN
  -- Get admin role ID
  SELECT id INTO admin_role_id FROM member_roles WHERE name = 'Admin';

  -- Update the user's profile
  UPDATE profiles
  SET
    role_id = admin_role_id,
    is_staff = true
  WHERE email = user_email;

  RAISE NOTICE 'Admin role assigned successfully!';
END $$;
```

## Using the Permission System

### In React Components

```tsx
import { usePermissions } from '@/lib/hooks/use-permissions';

function MyComponent() {
  const { hasPermission, isAdmin, isStaff, role } = usePermissions();

  if (hasPermission('content.create')) {
    // Show create content button
  }

  if (isAdmin()) {
    // Show admin-only features
  }

  return <div>Content based on permissions</div>;
}
```

### Permission Checks

Available methods:
- `hasPermission(permission: string)` - Check single permission
- `hasAnyPermission(permissions: string[])` - Check if user has any of the permissions
- `hasAllPermissions(permissions: string[])` - Check if user has all permissions
- `isAdmin()` - Check if user is admin
- `isStaff` - Boolean indicating if user is staff

### Available Permissions

**Content:**
- `content.create` - Create new content
- `content.read` - View content
- `content.update` - Edit content
- `content.delete` - Delete content
- `content.publish` - Publish/unpublish content

**Users:**
- `users.create` - Create users
- `users.read` - View user information
- `users.update` - Edit user information
- `users.delete` - Delete users
- `users.manage_roles` - Assign/change user roles

**Activities:**
- `activities.create` - Create activities
- `activities.read` - View activities
- `activities.update` - Edit activities
- `activities.delete` - Delete activities
- `activities.assign` - Assign activities to users
- `activities.review` - Review and provide feedback

**Events:**
- `events.create` - Create events
- `events.read` - View events
- `events.update` - Edit events
- `events.delete` - Delete events
- `events.manage` - Manage event registrations

**Settings:**
- `settings.read` - View system settings
- `settings.update` - Modify system settings
- `roles.manage` - Create and modify roles
- `tiers.manage` - Create and modify member tiers

## Security Features

1. **Row Level Security (RLS)** - Enabled on all RBAC tables
2. **Admin-only modifications** - Only admins can modify roles and permissions
3. **Protected routes** - Admin pages check permissions before rendering
4. **Automatic staff flag** - Staff roles automatically set `is_staff = true`
5. **Permission-based UI** - Features are hidden based on permissions

## Next Steps

1. Create your admin account using the steps above
2. Log in with admin credentials
3. Access the admin panel from the user menu
4. Assign roles to other users as needed
5. Configure permissions for different roles if required

## Troubleshooting

If you can't access the admin panel:
1. Verify you're logged in
2. Check that your role is set to Admin in the database
3. Verify `is_staff` is set to `true` in your profile
4. Clear your browser cache and reload the page
