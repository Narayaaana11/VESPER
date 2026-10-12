import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/glass_card.dart';
import '../view_models/settings_view_model.dart';

class SettingsScreen extends StatefulWidget {
  final SettingsViewModel viewModel;

  const SettingsScreen({super.key, required this.viewModel});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late TextEditingController _apiKeyController;
  bool _obscureApiKey = true;

  @override
  void initState() {
    super.initState();
    _apiKeyController = TextEditingController(text: widget.viewModel.settings.groqApiKey);
  }

  @override
  void dispose() {
    _apiKeyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.viewModel,
      builder: (context, _) {
        final settings = widget.viewModel.settings;

        return Scaffold(
          backgroundColor: AppTheme.background,
          appBar: AppBar(
            title: const Text('Settings & Engine'),
          ),
          body: SafeArea(
            child: ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                // Speech Engine Section
                _buildSectionHeader('SPEECH ENGINE & INFERENCE'),
                GlassCard(
                  child: Column(
                    children: [
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('100% On-Device Offline Mode', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w600)),
                        subtitle: const Text('Zero external network calls; processes audio on device CPU', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                        value: settings.isOfflineMode,
                        activeColor: AppTheme.emeraldSuccess,
                        onChanged: widget.viewModel.toggleOfflineMode,
                      ),
                      if (!settings.isOfflineMode) ...[
                        const Divider(color: AppTheme.surfaceBorder),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _apiKeyController,
                          obscureText: _obscureApiKey,
                          style: const TextStyle(color: AppTheme.textPrimary),
                          onChanged: widget.viewModel.setApiKey,
                          decoration: InputDecoration(
                            labelText: 'Groq Cloud API Key (gsk_...)',
                            labelStyle: const TextStyle(color: AppTheme.textSecondary),
                            filled: true,
                            fillColor: AppTheme.surfaceCard,
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                            suffixIcon: IconButton(
                              icon: Icon(_obscureApiKey ? Icons.visibility_off : Icons.visibility, color: AppTheme.textMuted),
                              onPressed: () => setState(() => _obscureApiKey = !_obscureApiKey),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Speech & Language
                _buildSectionHeader('LANGUAGE'),
                GlassCard(
                  child: DropdownButtonFormField<String>(
                    value: settings.speechLanguage,
                    dropdownColor: AppTheme.surfaceCard,
                    style: const TextStyle(color: AppTheme.textPrimary),
                    decoration: const InputDecoration(
                      labelText: 'Primary Dictation Language',
                      labelStyle: TextStyle(color: AppTheme.textSecondary),
                      border: InputBorder.none,
                    ),
                    items: const [
                      DropdownMenuItem(value: 'auto', child: Text('Auto-Detect Language')),
                      DropdownMenuItem(value: 'en', child: Text('English (US / UK)')),
                      DropdownMenuItem(value: 'es', child: Text('Spanish (Español)')),
                      DropdownMenuItem(value: 'fr', child: Text('French (Français)')),
                      DropdownMenuItem(value: 'de', child: Text('German (Deutsch)')),
                      DropdownMenuItem(value: 'hi', child: Text('Hindi (हिन्दी)')),
                      DropdownMenuItem(value: 'ja', child: Text('Japanese (日本語)')),
                      DropdownMenuItem(value: 'zh', child: Text('Chinese (Mandarin)')),
                    ],
                    onChanged: (val) {
                      if (val != null) widget.viewModel.setLanguage(val);
                    },
                  ),
                ),

                const SizedBox(height: 20),

                // Audio & Haptics Feedback
                _buildSectionHeader('FEEDBACK & SOUNDS'),
                GlassCard(
                  child: Column(
                    children: [
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Auditory Chimes', style: TextStyle(color: AppTheme.textPrimary)),
                        subtitle: const Text('Pleasant auditory cues on recording start and stop', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                        value: settings.soundFeedback,
                        activeColor: AppTheme.primary,
                        onChanged: widget.viewModel.toggleSound,
                      ),
                      const Divider(color: AppTheme.surfaceBorder),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Tactile Haptic Feedback', style: TextStyle(color: AppTheme.textPrimary)),
                        subtitle: const Text('Vibrates softly on mic press and transcript copy', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                        value: settings.hapticFeedback,
                        activeColor: AppTheme.primary,
                        onChanged: widget.viewModel.toggleHaptics,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Smart Text Behaviors
                _buildSectionHeader('BEHAVIOR & POLISHING'),
                GlassCard(
                  child: Column(
                    children: [
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Auto-Copy to Clipboard', style: TextStyle(color: AppTheme.textPrimary)),
                        subtitle: const Text('Immediately copies polished text to clipboard on finish', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                        value: settings.autoCopyToClipboard,
                        activeColor: AppTheme.primary,
                        onChanged: widget.viewModel.toggleAutoCopy,
                      ),
                      const Divider(color: AppTheme.surfaceBorder),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('English Letters Only', style: TextStyle(color: AppTheme.textPrimary)),
                        subtitle: const Text('Transliterates speech into Latin letters only', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                        value: settings.englishLettersOnly,
                        activeColor: AppTheme.primary,
                        onChanged: widget.viewModel.toggleEnglishOnly,
                      ),
                      const Divider(color: AppTheme.surfaceBorder),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Code Context Optimization', style: TextStyle(color: AppTheme.textPrimary)),
                        subtitle: const Text('Recognizes camelCase, snake_case, and Git commands', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12)),
                        value: settings.codeContextOptimization,
                        activeColor: AppTheme.primary,
                        onChanged: widget.viewModel.toggleCodeContext,
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Android Floating Overlay Info
                _buildSectionHeader('SYSTEM OVERLAY'),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.layers_rounded, color: AppTheme.secondary, size: 20),
                          SizedBox(width: 8),
                          Text('Floating Mic Capsule', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Allows VESPER Flow to display a floating microphone pill over other Android apps (WhatsApp, Slack, Gmail, Notes) so you can dictate anywhere.',
                        style: TextStyle(color: AppTheme.textSecondary, fontSize: 13, height: 1.4),
                      ),
                      const SizedBox(height: 12),
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.primary,
                          side: const BorderSide(color: AppTheme.primary),
                        ),
                        icon: const Icon(Icons.open_in_new_rounded, size: 16),
                        label: const Text('Grant Overlay Permission'),
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Display over other apps enabled for VESPER Flow')),
                          );
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4.0, bottom: 8.0),
      child: Text(
        title,
        style: const TextStyle(
          color: AppTheme.textMuted,
          fontSize: 11,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
