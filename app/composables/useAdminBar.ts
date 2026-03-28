export const useAdminBar = () => {
  return useState<boolean>('admin_bar_visible', () => false)
}
