import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Dynamic live audio waveform visualizer
/// Replicating the signature React Bits Pro Waveform from VESPER Desktop / Wispr Flow.
class AnimatedWaveform extends StatefulWidget {
  final bool isRecording;
  final double soundLevel; // Normalized 0.0 to 1.0
  final double height;
  final int barCount;

  const AnimatedWaveform({
    super.key,
    required this.isRecording,
    this.soundLevel = 0.0,
    this.height = 64.0,
    this.barCount = 18,
  });

  @override
  State<AnimatedWaveform> createState() => _AnimatedWaveformState();
}

class _AnimatedWaveformState extends State<AnimatedWaveform>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animController,
      builder: (context, child) {
        return SizedBox(
          height: widget.height,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: List.generate(widget.barCount, (index) {
              return _buildBar(index);
            }),
          ),
        );
      },
    );
  }

  Widget _buildBar(int index) {
    double barHeight;

    if (widget.isRecording) {
      // Dynamic height responding to real-time microphone sound level
      final phase = (_animController.value * 2 * pi) + (index * 0.4);
      final sinFactor = (sin(phase) + 1.0) / 2.0; // 0.0 to 1.0
      final baseLevel = 0.15;
      final dynamicLevel = widget.soundLevel > 0.05
          ? widget.soundLevel * 0.85
          : 0.25 * sinFactor;

      barHeight = (baseLevel + dynamicLevel * sinFactor) * widget.height;
    } else {
      // Idle gentle undulating wave
      final idlePhase = (_animController.value * 2 * pi) + (index * 0.3);
      final idleWave = (sin(idlePhase) + 1.0) / 2.0;
      barHeight = (0.12 + 0.12 * idleWave) * widget.height;
    }

    barHeight = barHeight.clamp(4.0, widget.height);

    return Container(
      width: 4.0,
      height: barHeight,
      margin: const EdgeInsets.symmetric(horizontal: 2.5),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        gradient: LinearGradient(
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
          colors: widget.isRecording
              ? [
                  AppTheme.primary,
                  AppTheme.secondary,
                  Color.lerp(AppTheme.secondary, Colors.white, 0.4)!,
                ]
              : [
                  AppTheme.textMuted.withOpacity(0.3),
                  AppTheme.primary.withOpacity(0.4),
                ],
        ),
        boxShadow: widget.isRecording
            ? [
                BoxShadow(
                  color: AppTheme.primary.withOpacity(0.35),
                  blurRadius: 6,
                  spreadRadius: 1,
                ),
              ]
            : null,
      ),
    );
  }
}
