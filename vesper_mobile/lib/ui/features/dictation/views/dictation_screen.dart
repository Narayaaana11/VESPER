import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/animated_waveform.dart';
import '../../../core/widgets/glass_card.dart';
import '../../../core/widgets/status_pill.dart';
import '../view_models/dictation_view_model.dart';

class DictationScreen extends StatelessWidget {
  final DictationViewModel viewModel;

  const DictationScreen({super.key, required this.viewModel});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: viewModel,
      builder: (context, _) {
        return Scaffold(
          backgroundColor: AppTheme.background,
          appBar: _buildAppBar(context),
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 10),

                  // Status Pill Indicator
                  StatusPill(state: viewModel.state),

                  const SizedBox(height: 24),

                  // React Bits Pro Animated Waveform Visualizer
                  AnimatedWaveform(
                    isRecording: viewModel.isRecording,
                    soundLevel: viewModel.soundLevel,
                    height: 72,
                    barCount: 20,
                  ),

                  const SizedBox(height: 28),

                  // The Interactive Floating Mic Capsule (Hold or Tap to Record)
                  _buildMicrophoneCapsule(),

                  const SizedBox(height: 20),

                  Text(
                    viewModel.isRecording
                        ? 'Release or Tap to Finish Dictation'
                        : 'Hold or Tap to Speak',
                    style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Tone Quick-Selection Chips
                  _buildToneSelector(),

                  const SizedBox(height: 24),

                  // Polished Text / Live Transcript Output Card
                  _buildOutputCard(context),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    return AppBar(
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.primary, AppTheme.secondary],
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.graphic_eq_rounded, size: 18, color: Colors.white),
          ),
          const SizedBox(width: 10),
          const Text(
            'VESPER Flow',
            style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold),
          ),
        ],
      ),
      actions: [
        // Offline / Local Engine Indicator Badge
        Container(
          margin: const EdgeInsets.only(right: 16),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: AppTheme.emeraldSuccess.withOpacity(0.15),
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: AppTheme.emeraldSuccess.withOpacity(0.3)),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.bolt_rounded, size: 14, color: AppTheme.emeraldSuccess),
              SizedBox(width: 4),
              Text(
                '100% Local',
                style: TextStyle(
                  color: AppTheme.emeraldSuccess,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMicrophoneCapsule() {
    final isRec = viewModel.isRecording;

    return GestureDetector(
      onTap: () {
        if (isRec) {
          viewModel.stopRecording();
        } else {
          viewModel.startRecording();
        }
      },
      onLongPressStart: (_) {
        if (!isRec) viewModel.startRecording();
      },
      onLongPressEnd: (_) {
        if (isRec) viewModel.stopRecording();
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        width: isRec ? 120 : 100,
        height: isRec ? 120 : 100,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isRec
                ? [AppTheme.roseDanger, Color(0xFFE11D48)]
                : [AppTheme.primary, AppTheme.secondary],
          ),
          boxShadow: [
            BoxShadow(
              color: (isRec ? AppTheme.roseDanger : AppTheme.primary).withOpacity(0.4),
              blurRadius: isRec ? 28 : 16,
              spreadRadius: isRec ? 6 : 2,
            ),
          ],
        ),
        child: Center(
          child: Icon(
            isRec ? Icons.stop_rounded : Icons.mic_rounded,
            size: isRec ? 48 : 42,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildToneSelector() {
    final tones = [
      {'id': 'natural', 'label': 'Natural', 'icon': Icons.auto_awesome_rounded},
      {'id': 'concise', 'label': 'Concise', 'icon': Icons.bolt_rounded},
      {'id': 'formal', 'label': 'Formal', 'icon': Icons.business_center_rounded},
      {'id': 'bullets', 'label': 'Bullets', 'icon': Icons.format_list_bulleted_rounded},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: tones.map((t) {
          final isSelected = viewModel.currentTone == t['id'];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: ChoiceChip(
              avatar: Icon(
                t['icon'] as IconData,
                size: 15,
                color: isSelected ? Colors.white : AppTheme.textMuted,
              ),
              label: Text(
                t['label'] as String,
                style: TextStyle(
                  color: isSelected ? Colors.white : AppTheme.textSecondary,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  fontSize: 12,
                ),
              ),
              selected: isSelected,
              selectedColor: AppTheme.primary,
              backgroundColor: AppTheme.surfaceCard,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(999),
                side: BorderSide(
                  color: isSelected ? AppTheme.primary : AppTheme.surfaceBorder,
                ),
              ),
              onSelected: (_) => viewModel.changeTone(t['id'] as String),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildOutputCard(BuildContext context) {
    final hasContent = viewModel.polishedText.isNotEmpty || viewModel.rawTranscript.isNotEmpty;

    return GlassCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Transcribed Dictation',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              if (hasContent)
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.copy_rounded, size: 19, color: AppTheme.textSecondary),
                      tooltip: 'Copy to Clipboard',
                      onPressed: viewModel.copyToClipboard,
                    ),
                    IconButton(
                      icon: const Icon(Icons.share_rounded, size: 19, color: AppTheme.textSecondary),
                      tooltip: 'Share via Android',
                      onPressed: viewModel.shareText,
                    ),
                    IconButton(
                      icon: const Icon(Icons.clear_rounded, size: 19, color: AppTheme.textMuted),
                      tooltip: 'Clear',
                      onPressed: viewModel.clear,
                    ),
                  ],
                ),
            ],
          ),
          const Divider(color: AppTheme.surfaceBorder, height: 20),
          ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 120),
            child: hasContent
                ? SelectableText(
                    viewModel.polishedText.isNotEmpty
                        ? viewModel.polishedText
                        : viewModel.rawTranscript,
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 16,
                      height: 1.55,
                      letterSpacing: 0.1,
                    ),
                  )
                : const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 36.0),
                      child: Text(
                        'Your cleaned voice transcript will appear here.\nTap the microphone and say anything.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: AppTheme.textMuted,
                          fontSize: 13,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ),
          ),
          if (viewModel.durationMs > 0 && hasContent)
            Padding(
              padding: const EdgeInsets.only(top: 12.0),
              child: Row(
                children: [
                  const Icon(Icons.timer_outlined, size: 13, color: AppTheme.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    '${(viewModel.durationMs / 1000).toStringAsFixed(1)}s',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                  ),
                  const SizedBox(width: 14),
                  const Icon(Icons.text_fields_rounded, size: 13, color: AppTheme.textMuted),
                  const SizedBox(width: 4),
                  Text(
                    '${viewModel.polishedText.split(RegExp(r'\s+')).where((w) => w.isNotEmpty).length} words',
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
