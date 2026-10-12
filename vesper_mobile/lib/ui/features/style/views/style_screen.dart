import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/glass_card.dart';
import '../view_models/style_view_model.dart';

class StyleScreen extends StatelessWidget {
  final StyleViewModel viewModel;

  const StyleScreen({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: viewModel,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: AppTheme.background,
          appBar: AppBar(
            title: const Text('Polishing Tone Styles'),
          ),
          body: SafeArea(
            child: ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                const Text(
                  'Select your default polishing style. VESPER rewrites your speech seamlessly using 100% on-device deterministic rules.',
                  style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.45),
                ),
                const SizedBox(height: 16),

                // Style Profile Cards
                ...viewModel.profiles.map((profile) {
                  final isSelected = viewModel.selectedTone == profile.id;

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: GlassCard(
                      borderColor: isSelected ? AppTheme.primary : AppTheme.surfaceBorder,
                      backgroundColor: isSelected ? AppTheme.surfaceHighlight : AppTheme.surfaceCard,
                      onTap: () => viewModel.selectTone(profile.id),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                                    color: isSelected ? AppTheme.primary : AppTheme.textMuted,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    profile.name,
                                    style: TextStyle(
                                      color: isSelected ? Colors.white : AppTheme.textPrimary,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              if (profile.isDefault)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primary.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text(
                                    'RECOMMENDED',
                                    style: TextStyle(color: AppTheme.primary, fontSize: 9, fontWeight: FontWeight.bold),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            profile.description,
                            style: const TextStyle(color: AppTheme.textSecondary, fontSize: 13),
                          ),
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppTheme.background.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'SAMPLE OUTPUT:',
                                  style: TextStyle(color: AppTheme.textMuted, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  viewModel.getSampleOutput(profile.id),
                                  style: const TextStyle(
                                    color: AppTheme.cyanAccent,
                                    fontSize: 12,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }
}
