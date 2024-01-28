export const allowedRouteUser = (route: string): string[] => {
    switch (route) {
      case '/':
        return ['Admin']
      case '/influencers':
        return ['Admin']
      case '/tasks-payments':
        return ['Admin']
      case '/report':
        return ['Admin']
      case '/profile':
        return ['Admin']
      default:
        return []
    }
  }