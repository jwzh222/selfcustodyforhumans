#!/usr/bin/env python3
"""把操作录屏一键转成网站可用的 GIF + 高清 video。

用法:
  python make-demo.py <源视频路径> [--name create-wallet-demo] [--outdir public/videos] [--width 600] [--fps 10] [--gif-max-sec 12]

产物:
  <outdir>/<name>.gif   循环动图（调色板优化，文字更清晰）
  <outdir>/<name>.mp4   高清 h264，带 faststart，全浏览器兼容
  <outdir>/<name>.webm  vp9 版本，体积更小
"""
import argparse
import os
import subprocess
import sys

import imageio_ffmpeg


def ffmpeg():
    return imageio_ffmpeg.get_ffmpeg_exe()


def run(cmd):
    print("+", " ".join(cmd))
    r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if r.returncode != 0:
        sys.stderr.write(r.stderr.decode("utf-8", "ignore"))
        sys.exit(f"ffmpeg 失败 (exit {r.returncode})")
    return r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src", help="源视频文件 (mp4/mov/webm/mkv ...)")
    ap.add_argument("--name", default="create-wallet-demo")
    ap.add_argument("--outdir", default="public/videos")
    ap.add_argument("--width", type=int, default=600, help="GIF 宽度像素，高度按比例")
    ap.add_argument("--fps", type=int, default=10, help="GIF 帧率")
    ap.add_argument("--gif-max-sec", type=int, default=12, help="GIF 最长秒数，超出只取前段")
    args = ap.parse_args()

    if not os.path.isfile(args.src):
        sys.exit(f"找不到源文件: {args.src}")
    os.makedirs(args.outdir, exist_ok=True)
    ff = ffmpeg()
    base = os.path.join(args.outdir, args.name)
    gif = base + ".gif"
    mp4 = base + ".mp4"
    webm = base + ".webm"
    pal = os.path.join(args.outdir, args.name + "_palette.png")

    # 1) 调色板
    run([
        ff, "-i", args.src,
        "-vf", f"fps={args.fps},scale={args.width}:-1:flags=lanczos,palettegen=max_colors=256",
        "-y", pal,
    ])
    # 2) GIF
    gif_filter = f"fps={args.fps},scale={args.width}:-1:flags=lanczos[x];[x][1:v]paletteuse"
    run([ff, "-i", args.src, "-i", pal, "-t", str(args.gif_max_sec),
         "-filter_complex", gif_filter, "-y", gif])
    # 3) 高清 mp4
    run([ff, "-i", args.src, "-c:v", "libx264", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", "-crf", "23", "-y", mp4])
    # 4) webm
    run([ff, "-i", args.src, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-y", webm])

    for p in (gif, mp4, webm):
        print(f"  {p}: {os.path.getsize(p)//1024} KB")
    print("完成。GIF 与 video 已生成，可嵌入 create-wallet.md。")


if __name__ == "__main__":
    main()
