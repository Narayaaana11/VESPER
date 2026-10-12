import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AppNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTabSelected;

  const AppNavBar({
    super.key,
    required this.currentIndex,
    required this.onTabSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.surface,
        border: Border(top: BorderSide(color: AppTheme.surfaceBorder, width: 1)),
      ),
      child: SafeArea(
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: onTabSelected,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: AppTheme.primary,
          unselectedItemColor: AppTheme.textMuted,
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.graphic_eq_rounded),
              activeIcon: Icon(Icons.graphic_eq_rounded, color: AppTheme.primary),
              label: 'Flow',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history_rounded),
              label: 'History',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.auto_awesome_motion_rounded),
              label: 'Snippets',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.spellcheck_rounded),
              label: 'Dictionary',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.style_outlined),
              label: 'Style',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.psychology_outlined),
              label: 'Assistant',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.settings_outlined),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }
}
